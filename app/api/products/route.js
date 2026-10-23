import db from '@/lib/db';
import Product from '@/models/Product';
import { isAdmin } from '@/lib/auth';

export async function GET() {
  await db();
  return Response.json(await Product.find().sort('-createdAt').lean());
}

export async function POST(req) {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await db();
  const { name, category, size, color, description, images = [] } = await req.json();
  return Response.json(await Product.create({ name, category, size, color, description, images }));
}