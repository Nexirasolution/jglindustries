import Link from 'next/link';
import db from '@/lib/db';
import Project from '@/models/Project';
import Product from '@/models/Product';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

const sized = url => url.replace('/upload/', '/upload/w_700,q_auto,f_auto/');

const categories = [
  {
    name: 'Tiles',
    img: '/tiles.jpeg', // put your own image in /public and set the path here
    desc: 'Vitrified, ceramic, wall, floor and outdoor tiles for homes, shops and commercial spaces.',
  },
  {
    name: 'Interlock',
    img: '/interlock.jpeg', // put your own image in /public and set the path here
    desc: 'Durable interlocking paver blocks for driveways, parking areas, walkways and outdoor spaces.',
  },
];

export default async function Home() {
  let projects = [], products = [];
  try {
    await db();
    const [pr, pd] = await Promise.all([
      Project.find().sort('-createdAt').limit(3).lean(),
      Product.find().sort('-createdAt').lean(),
    ]);
    projects = JSON.parse(JSON.stringify(pr));
    products = JSON.parse(JSON.stringify(pd));
  } catch {}

  const items = categories.map(c => {
    const inCat = products.filter(p => p.category === c.name);
    const product = inCat[0] || null; // newest product in this category
    return { ...c, product };
  });

  return (<>
    <section className="hero"><div className="floaters" aria-hidden><i /><i /><i /><i /></div>
      <div className="wrap herogrid">
        <div><h1 className="h-in">Stone and tile that holds a building together.</h1>
          <p className="h-in d1">JGL Industries supplies and installs tiles, interlock for homes, shops and construction projects.</p>
          <div className="row h-in d2"><Link className="btn" href="/contact">Get a quote</Link><Link className="btn ghost" href="/projects">See our work</Link></div></div>
        <img src="/logo.jpeg" alt="JGL Industries logo" className="herologo h-in d3" />
      </div></section>

    <section className="stats"><div className="wrap statgrid"><div><b>1971</b><span>Serving since</span></div><div><b>3</b><span>Core materials</span></div><div><b>1 team</b><span>Supply to installation</span></div></div></section>

    <section className="sec"><div className="wrap"><Reveal><h2>What we supply</h2></Reveal>
      <div className="grid3">{items.map((c, i) => {
        const p = c.product;
        return (
          <Reveal key={c.name} delay={i * 120}>
            <Link href="/products" className="mcard">
              <div className="imgbox"><img src={c.img} alt={(p?.name || c.name) + ' sample'} loading="lazy" /></div>
              <div className="mbody">
                <small>{c.name}</small>
                <h3>{p ? p.name : c.name}</h3>
                {p && (p.size || p.color) && (
                  <ul className="specs">
                    {p.size && <li><b>Size:</b> {p.size}</li>}
                    {p.color && <li><b>Color:</b> {p.color}</li>}
                  </ul>
                )}
                <p className="clamp">{p?.description || c.desc}</p>
              </div>
            </Link>
          </Reveal>
        );
      })}</div></div></section>

    <section className="sec alt"><div className="wrap"><Reveal><h2>Recent projects</h2></Reveal>
      {projects.length ? <div className="grid3">{projects.map((p, i) => (
        <Reveal key={p._id} delay={i * 120}>
          <Link href="/projects" className="pcard">
            {p.images?.[0] && <div className="imgbox"><img src={sized(p.images[0].url)} alt={p.title} loading="lazy" /></div>}
            <div><h3>{p.title}</h3><p>{p.category}{p.location ? ` · ${p.location}` : ''}</p></div>
          </Link>
        </Reveal>
      ))}</div>
        : <p>Projects will appear here once added from the admin page.</p>}</div></section>

    <section className="cta"><div className="wrap"><Reveal><h2>Planning a floor, kitchen or facade?</h2><p>Tell us the space and we will suggest the right material.</p><Link className="btn light" href="/contact">Contact us</Link></Reveal></div></section>
  </>);
}