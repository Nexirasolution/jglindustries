import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import Panel from '@/components/AdminPanel';
export const metadata = { title: 'Admin | JGL Industries', robots: 'noindex' };
export default function Admin() { if (!isAdmin()) redirect('/admin/login'); return <Panel />; }
