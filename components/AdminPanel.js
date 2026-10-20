'use client';
import { useEffect, useState } from 'react';
const empty = { title: '', category: 'Tiles', location: '', description: '' };
export default function Panel() {
  const [f, setF] = useState(empty), [files, setFiles] = useState([]), [list, setList] = useState([]), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false);
  const load = () => fetch('/api/projects').then(r => r.json()).then(setList);
  useEffect(() => { load(); }, []);
  async function upload(file) {
    const s = await (await fetch('/api/sign')).json();
    const fd = new FormData();
    fd.append('file', file); fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    fd.append('timestamp', s.timestamp); fd.append('signature', s.signature); fd.append('folder', s.folder);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
    const d = await r.json();
    if (!d.secure_url) throw new Error(d.error?.message || 'Upload failed');
    return { url: d.secure_url, publicId: d.public_id };
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('Uploading images...');
    try {
      const images = [];
      for (const file of files) images.push(await upload(file));
      const r = await fetch('/api/projects', { method: 'POST', body: JSON.stringify({ ...f, images }) });
      if (!r.ok) throw new Error('Could not save project');
      setF(empty); setFiles([]); e.target.reset(); setMsg('Project published'); load();
    } catch (x) { setMsg(x.message); }
    setBusy(false);
  }
  async function del(id) { if (confirm('Delete this project and its images?')) { await fetch(`/api/projects/${id}`, { method: 'DELETE' }); load(); } }
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (<section className="sec"><div className="wrap"><h1>Admin: projects</h1>
    <form onSubmit={submit} className="form">
      <input required placeholder="Project title" value={f.title} onChange={set('title')} />
      <select value={f.category} onChange={set('category')}>{['Tiles', 'Marble', 'Granite', 'Other'].map(c => <option key={c}>{c}</option>)}</select>
      <input placeholder="Location" value={f.location} onChange={set('location')} />
      <textarea rows="4" placeholder="Description" value={f.description} onChange={set('description')} />
      <input type="file" accept="image/*" multiple onChange={e => setFiles([...e.target.files])} />
      <button className="btn" disabled={busy}>{busy ? 'Working...' : 'Publish project'}</button>{msg && <p>{msg}</p>}
    </form>
    <h2>Published projects</h2>
    {!list.length && <p>No projects yet. Add your first one above.</p>}
    {list.map(p => <div className="row between item" key={p._id}><span>{p.title} <small>({p.category}, {p.images?.length || 0} photos)</small></span><button className="btn ghost" onClick={() => del(p._id)}>Delete</button></div>)}
  </div></section>);
}
