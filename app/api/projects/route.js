import db from '@/lib/db';
import Project from '@/models/Project';
import { isAdmin } from '@/lib/auth';
export async function GET() { await db(); return Response.json(await Project.find().sort('-createdAt').lean()); }
export async function POST(req) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  return Response.json(await Project.create(await req.json()));
}
