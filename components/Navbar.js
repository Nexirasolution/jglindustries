'use client';
import { useState } from 'react';
import Link from 'next/link';
const links = [['/', 'Home'], ['/about', 'About'], ['/products', 'Products'], ['/projects', 'Projects'], ['/contact', 'Contact']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (<header className="nav"><div className="wrap navin">
    <Link href="/" className="brand"><img src="/logo.jpeg" alt="JGL Industries" /><span>JGL Industries</span></Link>
    <button className={'burger' + (open ? ' on' : '')} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /><i /></button>
    <nav className={open ? 'open' : ''}>{links.map(([h, t]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{t}</Link>)}</nav>
  </div></header>);
}
