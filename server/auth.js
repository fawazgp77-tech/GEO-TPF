import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
export const digest = (value) => createHash('sha256').update(value).digest('hex');
export async function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = await derive(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function checkPassword(password, stored) {
  const [salt, expected] = stored.split(':');
  const actual = (await hashPassword(password, salt)).split(':')[1];
  return timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
export function tokenFrom(req) {
  return (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('presence_session='))?.slice(17) || '';
}
export function sessionCookie(token, seconds, secure) {
  return `presence_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${seconds}${secure ? '; Secure' : ''}`;
}
export function createSession(db, userId, remember) {
  const token = randomBytes(32).toString('hex');
  const seconds = (remember ? 30 : 1) * 86400;
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(token), userId, Date.now() + seconds * 1000);
  return { token, seconds };
}
