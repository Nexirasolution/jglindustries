import './globals.css';
import Navbar from '@/components/Navbar';
export const metadata = { title: 'JGL Industries | Tiles, Marble & Granite', description: 'Premium tiles, marble and granite supplier and installer near Kattathurai, Tamil Nadu.' };
export default function Root({ children }) {
  return (<html lang="en"><body>
    <Navbar />
    <main>{children}</main>
    <footer><div className="wrap foot">
      <div><b>JGL Industries</b><p>Tiles, marble and granite since 1971.</p></div>
      <div><p>2/92/D, Chathivilai, Maruthoorkurichi (P.O)<br />Via Kattathurai</p></div>
      <div><p><a href="mailto:jglindustries1971@gmail.com">jglindustries1971@gmail.com</a><br />
        <a href="tel:+919486578962">9486578962</a> · <a href="tel:+919487437016">9487437016</a> · <a href="tel:+919095076840">9095076840</a></p></div>
    </div></footer>
  </body></html>);
}
