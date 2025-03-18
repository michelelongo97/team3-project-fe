import { useState, useEffect } from "react";
import SearchBar from '../ui/SearchBar'; // Import corretto del componente
import React, { useRef } from 'react';

export default function Slider() {
  const [fade, setFade] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const books = [
    {
      title: "Orgoglio e Pregiudizio",
      img: "/img/orgoglio.jpg",
      price: "14.99€"
    },
    {
      title: "Il Nome della Rosa",
      img: "/img/rosa.jpg",
      price: "18.50€",
    },
    {
      title: "Harry Potter e la Pietra Filosofale",
      img: "/img/potter.jpg",
      price: "15.99€",
    },
    {
      title: "La mia storia",
      img: "/img/la_mia_storia.jpg",
      price: "16.99€",
    },
    {
      title: "Steve Jobs",
      img: "/img/steve_jobs.jpg",
      price: "19.99€",
    },
  ];

  const searchBarRef = useRef(null); 

  const scrollToSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
      setFade(false);
      setTimeout(() => setFade(true), 300);
    }, 5000); 

    return () => clearInterval(interval);
  }, [books.length]);

  return (
    <div>
      <div className="book-slider-container">
        <div className="book-slider-title">
          <h3>Benvenuto nel nostro mondo</h3>
          <p>Esplora la bellezza delle nostre offerte, scopri un'esperienza unica e inizia il tuo viaggio con noi.</p>
        </div>
        <button onClick={scrollToSearchBar} className="esplora-btn">
          Esplora Ora <i class="fa-solid fa-magnifying-glass"></i>
        </button>
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
              className={`book-slider-indicator ${currentIndex === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
      <div ref={searchBarRef}> 
      </div>
    </div>
  );
};
