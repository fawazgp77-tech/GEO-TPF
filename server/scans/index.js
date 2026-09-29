import { createServer } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { createOpenAIProvider } from '../providers/openai.js';
import { createScanService } from './service.js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const providerKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL;
const ready = Boolean(url && publishableKey && secretKey && providerKey && model);

const publicClient = ready ? createClient(url, publishableKey, { auth: { persistSession: false } }) : null;
const db = ready ? createClient(url, secretKey, { auth: { persistSession: false } }) : null;
const service = ready ? createScanService(db, createOpenAIProvider({ apiKey: providerKey, model })) : null;

function send(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(data));
}

async function readBody(request) {
  let content = '';
  for await (const chunk of request) {
    content += chunk;
    if (content.length > 2048) throw new Error('Request body is too large.');
  }
  return JSON.parse(content);
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/health') return send(response, 200, { ready });
  if (request.method !== 'POST' || request.url !== '/scans') return send(response, 404, { error: 'Not found.' });
  if (!ready) return send(response, 503, { error: 'Scan worker needs SUPABASE_SECRET_KEY, OPENAI_API_KEY and OPENAI_MODEL in its server-only environment.' });
  const token = /^Bearer (.+)$/i.exec(request.headers.authorization || '')?.[1];
  if (!token) return send(response, 401, { error: 'Sign in to start a scan.' });
  try {
    const { data, error } = await publicClient.auth.getUser(token);
    if (error || !data.user) return send(response, 401, { error: 'Session expired. Sign in again.' });
    const body = await readBody(request);
    if (!/^[0-9a-f-]{36}$/i.test(body.businessId || '')) return send(response, 400, { error: 'Invalid business.' });
    const scan = await service.createScan(data.user.id, body.businessId);
    return send(response, 202, { scan });
  } catch (error) {
    const message = error.message || 'Could not start scan.';
    return send(response, /not found|already running|Verify|active prompt|limit/i.test(message) ? 400 : 500, { error: message });
  }
});

server.listen(Number(process.env.SCAN_PORT || 3002), process.env.SCAN_HOST || '127.0.0.1', () => {
  process.stdout.write(`Scan server listening on ${process.env.SCAN_HOST || '127.0.0.1'}:${process.env.SCAN_PORT || 3002}; ready=${ready}\n`);
});

if (ready) {
  async function poll() {
    try {
      const scan = await service.claimScan();
      if (scan) await service.processScan(scan.id);
    } catch (error) { process.stderr.write(`Scan worker error: ${error.message}\n`); }
    setTimeout(poll, 5000);
  }
  poll();
}
