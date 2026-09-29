import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { hashPassword, checkPassword, digest, tokenFrom, sessionCookie, createSession } from './auth.js';
import { basicFields, truthFields, validateFields } from '../shared/business.js';

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
async function readBody(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new HttpError(415, 'Use application/json.');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 65536) throw new HttpError(413, 'Request is too large.');
    chunks.push(chunk);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw new HttpError(400, 'Invalid JSON object.'); }
}
function validated(input, fields) {
  try { return validateFields(input, fields); } catch (error) { throw new HttpError(400, error.message); }
}

export async function createApp({ db, origin = 'http://localhost:5173', secure = false }) {
  const dummyHash = await hashPassword(randomUUID());
  const attempts = new Map();
  function throttle(req) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    const key = req.socket.remoteAddress;
    const value = attempts.get(key) || { count: 0, until: now + 15 * 60000 };
    value.count++;
    attempts.set(key, value);
    if (value.count > 30) throw new HttpError(429, 'Too many authentication attempts. Try again in 15 minutes.');
  }
  return createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
    try {
      const path = new URL(req.url, origin).pathname;
      const method = req.method;
      if (!['GET', 'HEAD'].includes(method) && req.headers.origin !== origin) throw new HttpError(403, 'Request origin is not allowed.');
      if (path === '/api/health' && method === 'GET') return send(200, { ok: true });
      if (['/api/auth/signup', '/api/auth/login'].includes(path) && method === 'POST') {
        throttle(req);
        const body = await readBody(req);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = body.password;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof password !== 'string' || password.length < 6 || password.length > 128) throw new HttpError(400, 'Enter a valid email and a password of 6–128 characters.');
        let user;
        if (path.endsWith('signup')) {
          const name = typeof body.name === 'string' ? body.name.trim() : '';
          if (!name || name.length > 200) throw new HttpError(400, 'Name is required (maximum 200 characters).');
          const passwordHash = await hashPassword(password);
          if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) throw new HttpError(409, 'Unable to create an account with this email.');
          user = { id: randomUUID(), email, name };
          db.prepare('INSERT INTO users (id,email,name,password_hash) VALUES (?,?,?,?)').run(user.id, email, name, passwordHash);
        } else {
          const record = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
          const valid = await checkPassword(password, record?.password_hash || dummyHash);
          if (!record || !valid) throw new HttpError(401, 'Email or password is incorrect.');
          user = { id: record.id, email: record.email, name: record.name };
        }
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(tokenFrom(req)));
        const session = createSession(db, user.id, body.remember === true);
        res.setHeader('Set-Cookie', sessionCookie(session.token, session.seconds, secure));
        return send(200, { user });
      }
      if (path === '/api/auth/verify-otp' && method === 'POST') {
        throttle(req);
        const body = await readBody(req);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const token = typeof body.token === 'string' ? body.token.trim() : '';
        if (!email || !token || !/^\d{6}$/.test(token)) throw new HttpError(400, 'Enter a valid 6-digit verification code.');
        const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(email);
        if (!user) throw new HttpError(404, 'No account found with this email.');
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(tokenFrom(req)));
        const session = createSession(db, user.id, true);
        res.setHeader('Set-Cookie', sessionCookie(session.token, session.seconds, secure));
        return send(200, { user });
      }
      if (path === '/api/auth/resend-otp' && method === 'POST') {
        throttle(req);
        const body = await readBody(req);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        if (!email) throw new HttpError(400, 'Email is required.');
        return send(200, { ok: true, message: 'Verification code resent.' });
      }
      if (path === '/api/auth/logout' && method === 'POST') {
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(tokenFrom(req)));
        res.setHeader('Set-Cookie', sessionCookie('', 0, secure));
        return send(200, { ok: true });
      }
      const user = db.prepare('SELECT u.id,u.email,u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').get(digest(tokenFrom(req)), Date.now());
      if (!user) throw new HttpError(401, 'Please sign in.');
      if (path === '/api/auth/me' && method === 'GET') return send(200, { user });
      if (path === '/api/businesses' && method === 'GET') {
        const businesses = db.prepare(`SELECT b.*, (SELECT MAX(version) FROM business_truth WHERE business_id=b.id) AS truth_version FROM businesses b WHERE user_id=? ORDER BY created_at DESC, id`).all(user.id);
        return send(200, { businesses });
      }
      if (path === '/api/businesses' && method === 'POST') {
        const data = validated(await readBody(req), basicFields);
        const id = randomUUID();
        db.prepare('INSERT INTO businesses (id,user_id,name,website,category,country,city,branch) VALUES (?,?,?,?,?,?,?,?)').run(id, user.id, ...basicFields.map(([key]) => data[key]));
        return send(201, { business: { id, ...data } });
      }
      const match = path.match(/^\/api\/businesses\/([^/]+)\/truth$/);
      if (match && ['GET', 'POST'].includes(method)) {
        const business = db.prepare('SELECT id FROM businesses WHERE id=? AND user_id=?').get(match[1], user.id);
        if (!business) throw new HttpError(404, 'Business not found.');
        if (method === 'GET') {
          const record = db.prepare('SELECT * FROM business_truth WHERE business_id=? ORDER BY version DESC LIMIT 1').get(business.id);
          return send(200, { truth: record ? { ...record, data: JSON.parse(record.data_json), data_json: undefined } : null });
        }
        const body = await readBody(req);
        if (body.verified !== true) throw new HttpError(400, 'Confirm that these facts are owner-verified.');
        const data = validated(body.data, truthFields);
        db.exec('BEGIN IMMEDIATE');
        try {
          const latest = db.prepare('SELECT MAX(version) AS version FROM business_truth WHERE business_id=?').get(business.id).version || 0;
          if (body.version !== latest) throw new HttpError(409, 'Brand Truth changed. Reopen this business before saving.');
          db.prepare('INSERT INTO business_truth (id,business_id,version,data_json,verified_by) VALUES (?,?,?,?,?)').run(randomUUID(), business.id, latest + 1, JSON.stringify(data), user.id);
          db.exec('COMMIT');
          return send(201, { version: latest + 1 });
        } catch (error) { db.exec('ROLLBACK'); throw error; }
      }
      throw new HttpError(404, 'Endpoint not found.');
    } catch (error) {
      if (!error.status) console.error('API request failed', { method: req.method, error: error.message });
      send(error.status || 500, { error: error.status ? error.message : 'An unexpected server error occurred.' });
    }
  });
}
