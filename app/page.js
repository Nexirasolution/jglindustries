import Link from 'next/link';
import db from '@/lib/db';
import Project from '@/models/Project';
import Reveal from '@/components/Reveal';
export const dynamic = 'force-dynamic';
const items = [['Tiles', '/tiles.svg', 'Floor, wall and outdoor tiles for homes and commercial spaces.'], ['Marble', '/marble.svg', 'Natural marble in classic and contemporary finishes.'], ['Granite', '/granite.svg', 'Hard-wearing granite for kitchens, steps and facades.']];
export default async function Home() {
  let projects = [];
  try { await db(); projects = JSON.parse(JSON.stringify(await Project.find().sort('-createdAt').limit(3).lean())); } catch {}
  return (<>
    <section className="hero"><div className="floaters" aria-hidden><i /><i /><i /><i /></div>
      <div className="wrap herogrid">
        <div><h1 className="h-in">Stone and tile that holds a building together.</h1>
          <p className="h-in d1">JGL Industries supplies and installs tiles, marble and granite for homes, shops and construction projects around Kattathurai.</p>
          <div className="row h-in d2"><Link className="btn" href="/contact">Get a quote</Link><Link className="btn ghost" href="/projects">See our work</Link></div></div>
        <img src="/logo.jpeg" alt="JGL Industries logo" className="herologo h-in d3" />
      </div></section>
    <section className="stats"><div className="wrap statgrid"><div><b>1971</b><span>Serving since</span></div><div><b>3</b><span>Core materials</span></div><div><b>1 team</b><span>Supply to installation</span></div></div></section>
    <section className="sec"><div className="wrap"><Reveal><h2>What we supply</h2></Reveal>
      <div className="grid3">{items.map(([t, img, d], i) => <Reveal key={t} delay={i * 120}><Link href="/products" className="mcard">
        <div className="imgbox"><img src={img} alt={t + ' sample'} /></div><div className="mbody"><h3>{t}</h3><p>{d}</p></div></Link></Reveal>)}</div></div></section>
    <section className="sec alt"><div className="wrap"><Reveal><h2>Recent projects</h2></Reveal>
      {projects.length ? <div className="grid3">{projects.map((p, i) => <Reveal key={p._id} delay={i * 120}><Link href="/projects" className="pcard">
        {p.images?.[0] && <div className="imgbox"><img src={p.images[0].url.replace('/upload/', '/upload/w_700,q_auto,f_auto/')} alt={p.title} /></div>}<div><h3>{p.title}</h3><p>{p.category}{p.location ? ` · ${p.location}` : ''}</p></div></Link></Reveal>)}</div>
        : <p>Projects will appear here once added from the admin page.</p>}</div></section>
    <section className="cta"><div className="wrap"><Reveal><h2>Planning a floor, kitchen or facade?</h2><p>Tell us the space and we will suggest the right material.</p><Link className="btn light" href="/contact">Contact us</Link></Reveal></div></section>
  </>);
}
