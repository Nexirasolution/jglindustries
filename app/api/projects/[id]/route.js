import db from '@/lib/db';
import Project from '@/models/Project';
import { isAdmin } from '@/lib/auth';
import { destroyImage } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  const { title, category, location, description, images = [] } = await req.json();
  const p = await Project.findById(params.id);
  if (!p) return Response.json({ error: 'Not found' }, { status: 404 });

  // images that were on the project before but are not in the new list
  const keep = new Set(images.map(i => i.publicId));
  const removed = (p.images || []).filter(i => !keep.has(i.publicId));

  Object.assign(p, { title, category, location, description, images });
  await p.save();
  await Promise.all(removed.map(i => destroyImage(i.publicId)));

  return Response.json(p);
}

export async function DELETE(_, { params }) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  const p = await Project.findByIdAndDelete(params.id);
  await Promise.all((p?.images || []).map(i => destroyImage(i.publicId)));
  return Response.json({ ok: true });
}