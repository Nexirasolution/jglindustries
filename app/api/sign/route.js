import crypto from 'crypto';
import { isAdmin } from '@/lib/auth';
export async function GET() {
  if (!isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const timestamp = Math.floor(Date.now() / 1000), folder = 'jgl-projects';
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest('hex');
  return Response.json({ timestamp, folder, signature });
}
