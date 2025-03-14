import React, { useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = (event) => {
    if (!event.trim()) {
      setResult(null); // Se il campo è vuoto, non mostra nulla
      return;
    }

    axios
      .get(`/books/search?q=${search}`)
      .then((response) => {
        setResult(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Errore nella ricerca:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(search); // Chiama la funzione di ricerca anche al submit
  };

  return (
    <section className="new-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Cerca un libro..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>
      <div>
        {result === null ? null : result.length > 0 ? (
          result.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <div className="book-total">
                <h2>{book.title}</h2>

                <div className="book-search">
                  <div className="book-search-image-container">
                    <img
                      className="book-search-image"
                      src={book.image}
                      alt={book.title}
                    />
                  </div>
                  <div className="book-info">
                    <div>di {book.author}</div>

                    {book.discountId &&
                    new Date() >= new Date(book.start_date) &&
                    new Date() <= new Date(book.end_date) ? (
                      book.discount_type === "percentage" ? (
                        <div>
                          <span>{book.price}€</span>
                          <span>{book.discountDescription}</span>
                          <span>
                            {(
                              book.price -
                              (book.price * book.value) / 100
                            ).toFixed(2)}
                            €
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span>{book.price}€</span>
                          <span>{book.discountDescription}</span>
                          <span>{book.value}€</span>
                        </div>
                      )
                    ) : (
                      <p>{book.price}€</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Nessun risultato</p>
        )}
      </div>
    </section>
  );
}
