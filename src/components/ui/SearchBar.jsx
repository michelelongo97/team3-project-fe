import React, { useState, useEffect } from "react";
import { useWishlistContext } from "../../context/WishlistContext";
import { useAlertContext } from "../../context/AlertContext";
import axios from "../../api/axios";
import { Link, useSearchParams } from "react-router";

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [result, setResult] = useState(null);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recenti");
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  const { setAlert } = useAlertContext();
  const [message, setMessage] = useState("");

  useEffect(() => {
    syncWishlist();
  }, []);

  
  useEffect(() => {
    if (searchParams.get("q")) {
      fetchSearch();
    }
  }, []); 

  const fetchSearch = () => {
    if (!search.trim()) {
      setResult(null);
      return;
    }
    axios
      .get(`/books/search?q=${search}`)
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error("Errore nella ricerca:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    setSearchParams({ q: search, sort: sortBy });
    fetchSearch();
  };

  //Carrello
  const addToCart = (book) => {
    axios
      .post("/cart", {
        id: book.id,
        quantity: 1,
      })
      .then((res) => {
        setMessage(res.data.message);
        setAlert({
          type: "success",
          message: "Articolo aggiunto al carrello",
        });
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
            "Errore durante l'aggiunta al carrello."
        );
      });
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
      <div className="searchbar-filter">
        <form onSubmit={handleSubmit} className="search-bar" id="searchbar">
          <input
            type="text"
            placeholder="Cerca un libro..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
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
            onChange={(e) => {
              setSortBy(e.target.value);
              setSearchParams({ q: search, sort: e.target.value });
            }}
            value={sortBy}
            className="sort-select"
          >
            <option value="recenti">Più recenti</option>
            <option value="prezzo">Prezzo più basso</option>
            <option value="nome">Ordine alfabetico</option>
          </select>
        </div>
      </div>
      <div>
        {result === null ? null : result.length > 0 ? (
          sortResults(result).map((book) => (
            <Link
              to={`/books/${generateSlug(book.title)}`}
              key={book.id}
              className="book-total"
            >
              <div className="book-search">
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
                        <div className="search-book-author">
                          di {book.author}
                        </div>
                      </div>
                      <div className="search-wish">
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
                    <div className="info-book">
                      <div>{book.description}</div>
                      <div className="prova">
                        <div className="search-buy-detail">
                          {book.discountId &&
                          new Date() >= new Date(book.start_date) &&
                          new Date() <= new Date(book.end_date) ? (
                            book.discount_type === "percentage" ? (
                              <div className="search-book-price">
                                <span className="original-price">
                                  {book.price}€
                                </span>
                                <span className="discount-text">
                                  {book.discountDescription}
                                </span>
                                <span className="final-price">
                                  {(
                                    book.price -
                                    (book.price * book.value) / 100
                                  ).toFixed(2)}
                                  €
                                </span>
                              </div>
                            ) : (
                              <div className="search-book-price">
                                <span className="original-price">
                                  {book.price}€
                                </span>
                                <span className="discount-text">
                                  {book.discountDescription}
                                </span>
                                <span className="final-price">
                                  {book.value}€
                                </span>
                              </div>
                            )
                          ) : (
                            <p className="search-book-price">{book.price}€</p>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(book);
                            }}
                            className="search-buy-button"
                          >
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="margin-cart">
                              Aggiungi al Carrello
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <h2>La tua ricerca: {search}</h2>
            <p>Ops! Purtroppo non siamo riusciti a trovare alcun risultato.</p>
          </div>
        )}
      </div>
    </section>
  );
}

