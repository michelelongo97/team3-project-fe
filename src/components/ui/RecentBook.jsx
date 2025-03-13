import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useRef } from "react";
import CardSinglePage from "./CardSinglePage";

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

  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Scorre di 300px a ogni click
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="last">
      <h1 className="title-last">PIÙ RECENTI</h1>
      {error && <p className="error-message">Errore: {error}</p>}
      {data.length > 0 ? (
        <div className="slider-wrapper">
          <button className="slider-btn btn-left" onClick={() => scroll(-1)}>
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div className="slider-track" ref={sliderRef}>
            {data.map((book, id) => (
              <div key={id} className="slider-item">
                <Link to={`/books/${book.id}`} className="book-card">
                  <img src={book.image} alt={book.title} />
                  <h4>{book.title}</h4>
                  {book.discountId &&
                  new Date() >= new Date(book.start_date) &&
                  new Date() <= new Date(book.end_date) ? (
                    book.discount_type === "percentage" ? (
                      // Sconto percentuale
                      <div>
                        <span className="old-price">{book.price}€</span>
                        <div>
                          <span>
                            {(
                              book.price -
                              (book.price * book.value) / 100
                            ).toFixed(2)}
                            €
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Sconto fisso
                      <div>
                        <span className="old-price">{book.price}€</span>
                        <div>
                          <span>{book.value}€</span>
                        </div>
                      </div>
                    )
                  ) : (
                    // Prodotto non scontato
                    <p className="book-price">{book.price}€</p>
                  )}
                </Link>
              </div>
            ))}
          </div>
          <button className="slider-btn btn-right" onClick={() => scroll(1)}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      ) : (
        <p>Nessun elemento disponibile</p>
      )}
    </section>
  );
}
