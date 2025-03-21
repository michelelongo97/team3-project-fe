import { Link } from "react-router";
import { useEffect } from "react";

export default function OurStory() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div>
      <div className="our-story-container">
        <h1 className="our-story-title">📖 La Nostra Storia</h1>
        <p className="our-story-text">
          Tutto è iniziato per caso. Siamo un gruppo di cinque appassionati di
          libri, ognuno con un background diverso, ma uniti dalla stessa
          passione: la lettura.
        </p>
        <p className="our-story-text">
          Un giorno, tra una chiacchierata e l'altra, ci siamo resi conto che
          trovare libri di qualità, a prezzi accessibili, non era sempre facile.
          Così è nata l’idea di creare il nostro e-commerce: uno spazio dedicato
          ai lettori, dove ogni libro racconta una storia e ogni acquisto è
          un'esperienza unica.
        </p>
        <p className="our-story-text">
          La nostra missione? Rendere i libri più accessibili e creare una
          community per chi ama la lettura tanto quanto noi.
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
