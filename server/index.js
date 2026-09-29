import { openDatabase } from './db.js';
import { createApp } from './app.js';
const origin = process.env.APP_ORIGIN || 'http://localhost:5173';
const secure = process.env.NODE_ENV === 'production';
if (secure && !origin.startsWith('https://')) throw new Error('Production APP_ORIGIN must use HTTPS.');
const db = openDatabase(process.env.DATABASE_PATH || './data/presence.sqlite');
const server = await createApp({ db, origin, secure });
server.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => console.log('PresenceAI API listening on localhost:' + (process.env.PORT || 3001)));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
