import { useState, useEffect } from "react";

export default function Slider() {
  const [fade, setFade] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const books = [
    {
      title: "Harry Potter e la Pietra Filosofale",
      img: "/img/potter.jpg",
      price: "15.99€",
    },
    {
      title: "Il Nome della Rosa",
      img: "/img/rosa.jpg",
      price: "18.50€",
    },
    {
      title: "Orgoglio e Pregiudizio",
      img: "/img/orgoglio.jpg",
      price: "14.99€",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="book-slider-container">
      <h2 className="book-slider-title">▽ Bestseller della Settimana</h2>
      <div className="book-slider">
        <img
          src={books[currentIndex].img}
          alt={books[currentIndex].title}
          className={`book-slider-image ${fade ? "fade-in" : "fade-out"}`}
        />
        <div className="book-slider-info">
          <p className="book-slider-title-text">{books[currentIndex].title}</p>
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
  );
}
