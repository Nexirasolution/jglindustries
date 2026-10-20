import db from '@/lib/db';
import Project from '@/models/Project';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Projects | JGL Industries' };
export default async function Projects() {
  let ps = [];
  try { await db(); ps = JSON.parse(JSON.stringify(await Project.find().sort('-createdAt').lean())); } catch {}
  return (<section className="sec"><div className="wrap"><h1>Our projects</h1>
    {!ps.length && <p>No projects added yet.</p>}
    {ps.map(p => <article className="proj" key={p._id}>
      <h2>{p.title}</h2><p className="meta">{p.category}{p.location ? ` · ${p.location}` : ''}</p><p>{p.description}</p>
      <div className="gallery">{p.images?.map(i => <a href={i.url} target="_blank" key={i.publicId}><img src={i.url.replace('/upload/', '/upload/w_600,q_auto,f_auto/')} alt={p.title} /></a>)}</div>
    </article>)}</div></section>);
}
