import { createServer } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import { createGeminiProvider } from '../providers/gemini.js';
import { createScanService } from './service.js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const providerKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const ready = Boolean(url && publishableKey && secretKey && providerKey);

const publicClient = ready ? createClient(url, publishableKey, { auth: { persistSession: false } }) : null;
const db = ready ? createClient(url, secretKey, { auth: { persistSession: false } }) : null;
const service = ready ? createScanService(db, createGeminiProvider({ apiKey: providerKey, model }),
  { requestIntervalMs: Number(process.env.GEMINI_REQUEST_INTERVAL_MS || 6000) }) : null;

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
  const retryMatch = /^\/scans\/([0-9a-f-]{36})\/measurement\/retry$/i.exec(request.url || '');
  if (request.method !== 'POST' || (request.url !== '/scans' && !retryMatch)) return send(response, 404, { error: 'Not found.' });
  if (!ready) return send(response, 503, { error: 'Scan worker needs SUPABASE_SECRET_KEY and GEMINI_API_KEY in its server-only environment.' });
  const token = /^Bearer (.+)$/i.exec(request.headers.authorization || '')?.[1];
  if (!token) return send(response, 401, { error: 'Sign in to start a scan.' });
  try {
    const { data, error } = await publicClient.auth.getUser(token);
    if (error || !data.user) return send(response, 401, { error: 'Session expired. Sign in again.' });
    if (retryMatch) return send(response, 202, { measurement: await service.retryMeasurement(data.user.id, retryMatch[1]) });
    const body = await readBody(request);
    if (!/^[0-9a-f-]{36}$/i.test(body.businessId || '')) return send(response, 400, { error: 'Invalid business.' });
    const scan = await service.createScan(data.user.id, body.businessId);
    return send(response, 202, { scan });
  } catch (error) {
    const message = error.message || 'Could not start scan.';
    return send(response, /not found|already running|Verify|active prompt|limit|Wait for|No failed/i.test(message) ? 400 : 500, { error: message });
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
      const measurement = await service.claimMeasurement();
      if (measurement) await service.processMeasurement(measurement.scan_id);
    } catch (error) { process.stderr.write(`Scan worker error: ${error.message}\n`); }
    setTimeout(poll, 5000);
  }
  poll();
}
