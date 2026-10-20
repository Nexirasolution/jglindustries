import crypto from 'crypto';
import db from '@/lib/db';
import Project from '@/models/Project';
import { isAdmin } from '@/lib/auth';
export async function DELETE(_, { params }) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  const p = await Project.findByIdAndDelete(params.id);
  for (const i of p?.images || []) {
    const ts = Math.floor(Date.now() / 1000);
    const sig = crypto.createHash('sha1').update(`public_id=${i.publicId}&timestamp=${ts}${process.env.CLOUDINARY_API_SECRET}`).digest('hex');
    await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
      method: 'POST', body: new URLSearchParams({ public_id: i.publicId, timestamp: ts, api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, signature: sig }) }).catch(() => {});
  }
  return Response.json({ ok: true });
}
