import mongoose from 'mongoose';
let c = global._m || (global._m = { conn: null, p: null });
export default async function db() {
  if (c.conn) return c.conn;
  c.p = c.p || mongoose.connect(process.env.MONGODB_URI);
  return (c.conn = await c.p);
}
