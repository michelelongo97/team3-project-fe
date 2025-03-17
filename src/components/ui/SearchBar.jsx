import React, { useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [sortBy, setSortBy] = useState("recenti");

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
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const sortResults = (books) => {
    if (!books) return [];

    return [...books].sort((a, b) => {
      if (sortBy === "prezzo") return a.price - b.price;
      if (sortBy === "nome")
        return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1;
      if (sortBy === "recenti") return new Date(b.date) - new Date(a.date);
      return 0;
    });
  };

  return (
    <section className="new-container">
      <form onSubmit={(e) => e.preventDefault()} className="search-bar">
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

      <div className="sort-section">
        <div>Ordina per:</div>
        <select
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          className="sort-select"
        >
          <option value="recenti">Più recenti</option>
          <option value="prezzo">Prezzo più basso</option>
          <option value="nome">Ordine alfabetico</option>
        </select>
      </div>

      <div>
        {result === null ? null : result.length > 0 ? (
          sortResults(result).map((book) => (
            <Link
  to={`/books/${book.title.replace(/\s+/g, "-").toLowerCase()}`}
  key={book.id}
  className="search-book-link"
>
  <div className="search-book-container">
    <div className="search-book-details">
      <div className="search-book-image-wrapper">
        <img
          className="search-book-image"
          src={book.image}
          alt={book.title}
        />
      </div>
      <div className="search-book-info">
        <div className="search-header">
          <div className="search-book-title">
            <h2>{book.title}</h2>
            <div className="search-book-author">di {book.author}</div>
          </div>
          <div className="search-wish">
            <i className="fa-regular fa-heart"></i>
          </div>
        </div>
        <div className="search-book-info">
          <div>{book.description}</div>
          <div className="search-buy-detail">
            {book.discountId &&
            new Date() >= new Date(book.start_date) &&
            new Date() <= new Date(book.end_date) ? (
              book.discount_type === "percentage" ? (
                <div className="search-book-price">
                  <span className="original-price">{book.price}€</span>
                  <span className="discount-text">{book.discountDescription}</span>
                  <span className="final-price">
                    {(book.price - (book.price * book.value) / 100).toFixed(2)}€
                  </span>
                </div>
              ) : (
                <div className="search-book-price">
                  <span className="original-price">{book.price}€</span>
                  <span className="discount-text">{book.discountDescription}</span>
                  <span className="final-price">{book.value}€</span>
                </div>
              )
            ) : (
              <p className="search-book-price">{book.price}€</p>
            )}
            <button className="search-buy-button">🛒 Aggiungi al Carrello</button>
          </div>
        </div>
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
