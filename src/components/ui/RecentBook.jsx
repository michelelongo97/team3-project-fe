import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

export default function RecentBook() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchBook = () => {
    axios
      .get(`/books`)
      .then((res) => {
        console.log("Dati ricevuti:", res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.error("Errore API:", error);
        setError(error.message);
      });
  };
  useEffect(fetchBook, []);

  return (
    <section className="last">
      <h2 className="title-last">PIÙ RECENTI</h2>
      {error && <p className="error-message">Errore: {error}</p>}
      {data.length > 0 ? (
        data.map((book, id) => (
          <Link to={`/books/${book.id}`} key={id} className="last-book">
            <img src={book.image} alt={book.title} />
            <div className="last-description">
              <h3>{book.title}</h3>
              <p>{book.description}</p>
            </div>
            <p className="last-price">
              {book.price ? `€ ${book.price}` : "Prezzo non disponibile"}
            </p>
          </Link>
        ))
      ) : (
        <p>Nessun elemento disponibile</p>
      )}
    </section>
  );
}
