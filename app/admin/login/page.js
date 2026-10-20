'use client';
import { useState } from 'react';
export default function Login() {
  const [pw, setPw] = useState(''), [err, setErr] = useState('');
  async function go(e) {
    e.preventDefault();
    const r = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) });
    r.ok ? (location.href = '/admin') : setErr('Wrong password');
  }
  return (<section className="sec"><div className="wrap narrow"><h1>Admin sign in</h1>
    <form onSubmit={go} className="form"><input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} />
      <button className="btn">Sign in</button>{err && <p className="err">{err}</p>}</form></div></section>);
}
