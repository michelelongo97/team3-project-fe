import React, { useState, useEffect } from "react";
import { useWishlistContext } from "../../context/WishlistContext";
import { useAlertContext } from "../../context/AlertContext";
import axios from "../../api/axios";
import { Link, useSearchParams } from "react-router";

export default function SearchBar({ addToCart }) {
  // Recupera i parametri di ricerca dall'URL (es. ?q=harry+potter&sort=prezzo)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Stato per il testo di ricerca, inizializzato con il valore dell'URL se presente
  const [search, setSearch] = useState(searchParams.get("q") || "");

  // Stato per memorizzare i risultati della ricerca
  const [result, setResult] = useState(null);

  // Stato per il criterio di ordinamento (default: "recenti")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recenti");

  // Recupera il contesto della wishlist
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  
  // Recupera la funzione per mostrare gli alert
  const { setAlert } = useAlertContext();

  // Sincronizza la wishlist all'avvio del componente
  useEffect(() => {
    syncWishlist();
  }, []);

  // Se c'è un parametro di ricerca nell'URL, avvia la ricerca all'avvio del componente
  useEffect(() => {
    if (searchParams.get("q")) {
      fetchSearch();
    }
  }, []);

  // Funzione per recuperare i risultati della ricerca dal server
  const fetchSearch = () => {
    if (!search.trim()) {
      setResult(null); // Se il campo di ricerca è vuoto, resetta i risultati
      return;
    }
    axios
      .get(`/books/search?q=${search}`) // Richiesta GET con il termine di ricerca
      .then((response) => {
        setResult(response.data); // Salva i risultati della ricerca nello stato
      })
      .catch((error) => {
        console.error("Errore nella ricerca:", error);
      });
  };

  // Gestisce l'invio del form di ricerca
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita il refresh della pagina
    if (!search.trim()) return;
    
    // Aggiorna i parametri dell'URL con il nuovo valore di ricerca e il criterio di ordinamento
    setSearchParams({ q: search, sort: sortBy });

    fetchSearch(); // Avvia la ricerca
  };

  // Funzione per aggiungere un libro al carrello e mostrare un messaggio di conferma
  const handleAddToCart = (book) => {
    addToCart(book); // Chiamata alla funzione passata dal componente padre

    setAlert({
      type: "success",
      message: "Articolo aggiunto al carrello",
    });
  };

  // Genera uno slug per l'URL del libro (es. "Harry Potter" → "harry-potter")
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // Funzione per ordinare i risultati della ricerca in base al criterio selezionato
  const sortResults = (books) => {
    if (!books) return [];

    return [...books].sort((a, b) => {
      if (sortBy === "prezzo") return a.price - b.price; // Ordina per prezzo crescente
      if (sortBy === "nome") return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1; // Ordina per titolo alfabetico
      if (sortBy === "recenti") return new Date(b.date) - new Date(a.date); // Ordina per data di uscita
      return 0;
    });
  };

  return (
    <section className="new-container">
      {/* Barra di ricerca e filtro */}
      <div className="searchbar-filter">
        <form
          onSubmit={handleSubmit}
          className="search-bar row-x"
          id="searchbar"
        >
          {/* Campo input per la ricerca */}
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

        {/* Sezione per la selezione del criterio di ordinamento */}
        <div className="sort-section">
          <div>Ordina per:</div>
          <select
            onChange={(e) => {
              setSortBy(e.target.value);
              setSearchParams({ q: search, sort: e.target.value }); // Aggiorna i parametri dell'URL
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

      {/* Sezione dei risultati */}
      <div>
        {/* Se non ci sono risultati */}
        {result === null ? null : result.length > 0 ? (
          // Se ci sono risultati, li mostra in ordine
          sortResults(result).map((book) => (
            <Link
              to={`/books/${generateSlug(book.title)}`}
              key={book.id}
              className="book-total"
            >
              <div className="book-search">
                <div className="search-book-details">
                  {/* Immagine del libro */}
                  <div className="search-book-image-wrapper">
                    <img
                      className="search-book-image"
                      src={book.image}
                      alt={book.title}
                    />
                  </div>
                  <div className="search-book-info">
                    <div className="search-header">
                      {/* Titolo e autore */}
                      <div className="search-book-title">
                        <h2>{book.title}</h2>
                        <div className="search-book-author">
                          di {book.author}
                        </div>
                      </div>
                      {/* Pulsante per aggiungere/rimuovere dalla wishlist */}
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
                          {/* Gestione dello sconto se presente */}
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
                          {/* Pulsante per aggiungere al carrello */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(book);
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
          <div className="no-results">Nessun risultato trovato</div>
        )}
      </div>
    </section>
  );
}

