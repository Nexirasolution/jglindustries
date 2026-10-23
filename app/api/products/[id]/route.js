import db from '@/lib/db';
import Product from '@/models/Product';
import { isAdmin } from '@/lib/auth';
import { destroyImage } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  const { name, category, size, color, description, images = [] } = await req.json();
  const p = await Product.findById(params.id);
  if (!p) return Response.json({ error: 'Not found' }, { status: 404 });

  const keep = new Set(images.map(i => i.publicId));
  const removed = (p.images || []).filter(i => !keep.has(i.publicId));

  Object.assign(p, { name, category, size, color, description, images });
  await p.save();
  await Promise.all(removed.map(i => destroyImage(i.publicId)));

  return Response.json(p);
}

export async function DELETE(_, { params }) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  const p = await Product.findByIdAndDelete(params.id);
  await Promise.all((p?.images || []).map(i => destroyImage(i.publicId)));
  return Response.json({ ok: true });
}