import { useState, useEffect } from "react";
import SearchBar from "../ui/SearchBar"; // Import corretto del componente
import React, { useRef } from "react";

export default function Slider() {
  // Stato per gestire l'effetto di transizione (fade-in/fade-out)
  const [fade, setFade] = useState(true);

  // Stato per tenere traccia dell'indice dell'immagine attualmente visualizzata
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array di libri da mostrare nello slider
  const books = [
    {
      title: "Orgoglio e Pregiudizio",
      img: "/img/orgoglio.jpg",
      price: "14.99€",
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

  // Riferimento alla barra di ricerca per poterci scorrere sopra
  const searchBarRef = useRef(null);

  // Funzione per scorrere la pagina fino alla barra di ricerca
  const scrollToSearchBar = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Effetto per cambiare l'immagine dello slider ogni 5 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length); // Passa all'immagine successiva
      setFade(false); // Inizio dell'effetto di transizione (fade-out)
      setTimeout(() => setFade(true), 300); // Dopo 300ms, attiva il fade-in
    }, 5000);

    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente viene smontato
  }, [books.length]);

  return (
    <div>
      <div className="book-slider-container">
        {/* Testo introduttivo dello slider */}
        <div className="book-slider-title">
          <h3>Benvenuto nel nostro mondo</h3>
          <p>
            Esplora la bellezza delle nostre offerte, scopri un'esperienza unica
            e inizia il tuo viaggio con noi.
          </p>
        </div>

        {/* Bottone per scorrere alla barra di ricerca */}
        <button onClick={scrollToSearchBar} className="esplora-btn">
          Esplora Ora <i className="fa-solid fa-magnifying-glass"></i>
        </button>

        {/* Sezione principale dello slider */}
        <div className="book-slider row-x">
          {/* Immagine del libro attuale */}
          <img
            src={books[currentIndex].img}
            alt={books[currentIndex].title}
            className={`book-slider-image ${fade ? "fade-in" : "fade-out"}`}
          />

          {/* Informazioni del libro attuale */}
          <div className="book-slider-info">
            <p className="book-slider-title-text">
              {books[currentIndex].title}
            </p>
            <p className="book-slider-price">{books[currentIndex].price}</p>
          </div>
        </div>

        {/* Indicatori di navigazione dello slider (pallini sotto l'immagine) */}
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

      {/* Riferimento alla barra di ricerca (vuoto, serve solo per lo scrolling) */}
      <div ref={searchBarRef}></div>
    </div>
  );
}
