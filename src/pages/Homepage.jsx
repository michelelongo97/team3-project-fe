import { useState, useEffect } from "react";
import instance from "../api/axios";

export default function Homepage() {
  const [fade, setFade] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const books = [
    {
      title: "Harry Potter e la Pietra Filosofale",
      img: "/img/potter.jpg",
      price: "€15.99",
    },
    {
      title: "Il Nome della Rosa",
      img: "/img/rosa.jpg",
      price: "€18.50",
    },
    {
      title: "Orgoglio e Pregiudizio",
      img: "/img/orgoglio.jpg",
      price: "€14.99",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const backendUrl = "http://localhost:3000";

    instance
      .get(`${backendUrl}/books`)
      .then((response) => {
        console.log("Dati ricevuti:", response.data);
        setData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Errore API:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="homepage">
      <div className="book-slider-container">
        <h2 className="book-slider-title">📚 Bestseller della Settimana</h2>
        <div className="book-slider">
          <img
            src={books[currentIndex].img}
            alt={books[currentIndex].title}
            className={`book-slider-image ${fade ? "fade-in" : "fade-out"}`}
          />
          <div className="book-slider-info">
            <p className="book-slider-title-text">
              {books[currentIndex].title}
            </p>
            <p className="book-slider-price">{books[currentIndex].price}</p>
          </div>
        </div>
        <div className="book-slider-indicators">
          {books.map((_, index) => (
            <span
              key={index}
              className={`book-slider-indicator ${
                currentIndex === index ? "active" : ""
              }`}
            />
          ))}
        </div>
      </div>
      <section className="search-bar">
        <input
          type="text"
          placeholder="Cerca un libro..."
          className="search-input"
        />
        <button className="search-button">🔍</button>
      </section>
      <section className="last">
        <h2 className="title-last">PIÙ RECENTI</h2>
        {error && <p className="error-message">Errore: {error}</p>}
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="last-book">
              <img src={item.image} alt={item.title} />
              <div className="last-description">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <p className="last-price">
                {item.price ? `€ ${item.price}` : "Prezzo non disponibile"}
              </p>
            </div>
          ))
        ) : (
          <p>Nessun elemento disponibile</p>
        )}
      </section>
    </div>
  );
}
