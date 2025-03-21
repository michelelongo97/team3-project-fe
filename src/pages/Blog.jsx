import { Link } from "react-router";
import { useEffect } from "react";

export default function Blog() {
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="blog-container">
        <h1 className="blog-title">📖 Blog e Novità</h1>
        <p className="blog-intro">
          Benvenuto nel nostro spazio dedicato agli amanti dei libri! Qui
          troverai aggiornamenti sulle ultime novità, approfondimenti e
          curiosità dal mondo della lettura.
        </p>
        <p className="blog-text">
          Scopri i nostri consigli, esplora interviste esclusive con autori e
          lasciati ispirare da storie uniche. Torna spesso per non perderti i
          nuovi articoli! 📚✨
        </p>
      </div>
      <div className="btn-footer">
        <Link to="/">
          <button className="return-home-btn-footer">←</button>{" "}
        </Link>
      </div>
    </div>
  );
}
