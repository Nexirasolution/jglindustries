import db from '@/lib/db';
import Product from '@/models/Product';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Products | JGL Industries' };

const CATEGORIES = ['Tiles', 'Interlock'];

export default async function Products() {
  let products = [];
  try {
    await db();
    products = JSON.parse(JSON.stringify(await Product.find().sort('-createdAt').lean()));
  } catch {}

  return (
    <section className="sec"><div className="wrap">
      <h1>Products</h1>
      {!products.length && <p>Our product range will appear here soon.</p>}

      {CATEGORIES.map(cat => {
        const items = products.filter(p => p.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <h2>{cat}</h2>
            <div className="grid3">
              {items.map((p, i) => (
                <Reveal key={p._id} delay={(i % 3) * 120}>
                  <div className="mcard">
                    {p.images?.[0] && (
                      <div className="imgbox">
                        <img src={p.images[0].url.replace('/upload/', '/upload/w_700,q_auto,f_auto/')} alt={p.name} loading="lazy" />
                      </div>
                    )}
                    <div className="mbody">
                      <h3>{p.name}</h3>
                      {(p.size || p.color) && (
                        <ul className="specs">
                          {p.size && <li><b>Size:</b> {p.size}</li>}
                          {p.color && <li><b>Color:</b> {p.color}</li>}
                        </ul>
                      )}
                      {p.description && <p>{p.description}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
    </div></section>
  );
}