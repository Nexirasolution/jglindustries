import { token } from '@/lib/auth';
export async function POST(req) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return Response.json({ error: 'Wrong password' }, { status: 401 });
  const r = Response.json({ ok: true });
  r.headers.set('Set-Cookie', `jgl_admin=${token()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  return r;
}
