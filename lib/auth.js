import crypto from 'crypto';
import { cookies } from 'next/headers';
export const token = () => crypto.createHmac('sha256', process.env.AUTH_SECRET).update(process.env.ADMIN_PASSWORD).digest('hex');
export const isAdmin = () => cookies().get('jgl_admin')?.value === token();
