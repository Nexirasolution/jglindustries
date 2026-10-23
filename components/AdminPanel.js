'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { uploadImage } from '@/lib/upload';
import s from './admin.module.css';

const empty = { title: '', category: 'Tiles', location: '', description: '' };

export default function Panel() {
  const [f, setF] = useState(empty);
  const [files, setFiles] = useState([]);
  const [existing, setExisting] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => fetch('/api/projects').then(r => r.json()).then(setList);
  useEffect(() => { load(); }, []);

  function reset(form) {
    setF(empty); setFiles([]); setExisting([]); setEditingId(null);
    form?.reset();
  }

  function startEdit(p) {
    setEditingId(p._id);
    setF({ title: p.title || '', category: p.category || 'Tiles', location: p.location || '', description: p.description || '' });
    setExisting(p.images || []);
    setFiles([]);
    setMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setMsg(files.length ? 'Uploading images...' : 'Saving...');
    try {
      const uploaded = [];
      for (const file of files) uploaded.push(await uploadImage(file));
      const images = [...existing, ...uploaded];

      const r = await fetch(editingId ? `/api/projects/${editingId}` : '/api/projects', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, images }),
      });
      if (!r.ok) throw new Error('Could not save project');

      setMsg(editingId ? 'Project updated' : 'Project published');
      reset(form);
      load();
    } catch (x) { setMsg(x.message); }
    setBusy(false);
  }

  async function del(id) {
    if (!confirm('Delete this project and its images?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (id === editingId) reset();
    load();
  }

  const set = k => e => setF({ ...f, [k]: e.target.value });
  const removeExisting = publicId => setExisting(existing.filter(i => i.publicId !== publicId));

  return (
    <section className="sec"><div className="wrap">
      <h1>Admin: projects</h1>
      <p><Link href="/admin/products">Manage products →</Link></p>

      <form onSubmit={submit} className={s.form}>
        {editingId && <p><strong>Editing project</strong></p>}
        <input required placeholder="Project title" value={f.title} onChange={set('title')} />
        <select value={f.category} onChange={set('category')}>
          {['Tiles', 'Interlock'].map(c => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="Location" value={f.location} onChange={set('location')} />
        <textarea rows="4" placeholder="Description" value={f.description} onChange={set('description')} />

        {editingId && existing.length > 0 && (
          <div className={s.thumbs}>
            {existing.map(i => (
              <div key={i.publicId} className={s.thumb}>
                <img src={i.url} alt="" loading="lazy" />
                <button type="button" className={s.remove}
                  onClick={() => removeExisting(i.publicId)} aria-label="Remove photo">✕</button>
              </div>
            ))}
          </div>
        )}

        <input className={s.file} type="file" accept="image/*" multiple
          onChange={e => setFiles([...e.target.files])} />
        {files.length > 0 && <small className={s.hint}>{files.length} new photo{files.length > 1 ? 's' : ''} selected</small>}
        {editingId && <small className={s.hint}>New photos are added to the ones above.</small>}

        <div className={s.actions}>
          <button className="btn" disabled={busy}>
            {busy ? 'Working...' : editingId ? 'Save changes' : 'Publish project'}
          </button>
          {editingId && (
            <button type="button" className="btn ghost" onClick={e => reset(e.currentTarget.form)}>
              Cancel edit
            </button>
          )}
        </div>
        {msg && <p>{msg}</p>}
      </form>

      <h2>Published projects</h2>
      {!list.length && <p>No projects yet. Add your first one above.</p>}
      {list.map(p => (
        <div className={s.item} key={p._id}>
          <span className={s.info}>
            {p.title} <small>({p.category}, {p.images?.length || 0} photos)</small>
          </span>
          <span className={s.itemActions}>
            <button className="btn ghost" onClick={() => startEdit(p)}>Edit</button>
            <button className="btn ghost" onClick={() => del(p._id)}>Delete</button>
          </span>
        </div>
      ))}
    </div></section>
  );
}