import Reveal from '@/components/Reveal';
export const metadata = { title: 'Products | JGL Industries' };
const P = [['Tiles', '/tiles.svg', ['Vitrified', 'Ceramic wall and floor', 'Outdoor and parking', 'Bathroom and kitchen']], ['Marble', '/marble.svg', ['Indian marble', 'Imported marble', 'Flooring and steps', 'Wall cladding']], ['Granite', '/granite.svg', ['Kitchen countertops', 'Staircases', 'Flooring', 'Compound walls and facades']]];
export default function Products() {
  return (<section className="sec"><div className="wrap"><h1>Products</h1>
    <div className="grid3">{P.map(([t, img, l], i) => <Reveal key={t} delay={i * 120}><div className="mcard"><div className="imgbox"><img src={img} alt={t + ' sample'} /></div>
      <div className="mbody"><h3>{t}</h3><ul>{l.map(x => <li key={x}>{x}</li>)}</ul></div></div></Reveal>)}</div></div></section>);
}
