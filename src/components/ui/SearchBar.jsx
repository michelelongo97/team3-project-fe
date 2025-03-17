import React, { useState, useEffect } from "react";
import { useWishlistContext } from "../../context/WishlistContext";
import axios from "../../api/axios";
import { Link } from "react-router";

export default function SearchBar() {
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();

  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [sortBy, setSortBy] = useState("recenti");
  useEffect(() => {
    syncWishlist();
  }, []);
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
            <Link to={`/books/${generateSlug(book.title)}`} key={book.id}>
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
                    <button
                      className="wishlist-button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(book.id);
                      }}
                    >
                      {wishlist.some((b) => b.id === book.id) ? (
                        <i className="fa-solid fa-heart"></i>
                      ) : (
                        <i className="fa-regular fa-heart"></i>
                      )}
                    </button>
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
