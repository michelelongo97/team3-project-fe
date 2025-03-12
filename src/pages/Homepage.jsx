import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Homepage() {
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
        setFade(true);
      }, 500);
    }, 5000); // Cambio ogni 5 secondi

    return () => clearInterval(interval);
  }, []);

  return (
    <>
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
          <Link to="/book-detail" className="detail-book">
            <div className="last-book">
              <img src="./img/rosa.jpg" alt="Il Nome della Rosa" />
              <div className="last-description">
                <h3>Il Nome della Rosa</h3>
                <p>DESCRIZIONE:</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
                  ab aliquid porro corrupti blanditiis quos nihil ullam.
                </p>
              </div>
              <div className="last-price">
                <p>15.99 €</p>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </>
  );
}
