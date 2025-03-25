import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../context/WishlistContext";
import { useAlertContext } from "../context/AlertContext";
import axios from "../api/axios";

export default function WishlistPage() {
  // Recupera lo stato della wishlist e le funzioni dal contesto
  const { wishlist, error, toggleWishlist, syncWishlist } = useWishlistContext();
  const { setAlert } = useAlertContext();

  // Stato per gestire i messaggi di errore o successo
  const [message, setMessage] = useState("");

  // Sincronizza la wishlist all'avvio della pagina
  useEffect(() => {
    syncWishlist();
  }, []);

  /**
   * Funzione per aggiungere un libro al carrello.
   * Effettua una richiesta HTTP POST per aggiungere un libro con quantità predefinita di 1.
   * Se l'operazione ha successo, aggiorna il messaggio e mostra un avviso.
   * Se si verifica un errore, cattura il messaggio di errore e lo visualizza.
   * @param {Object} book - Oggetto del libro da aggiungere al carrello.
   */
  const addToCart = (book) => {
    axios
      .post("/cart", {
        id: book.id,
        quantity: 1,
      })
      .then((res) => {
        setMessage(res.data.message); // Imposta il messaggio di conferma
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

  /**
   * Funzione per generare uno slug da un titolo.
   * Converte il titolo in minuscolo, sostituisce gli spazi con trattini e rimuove i caratteri non alfanumerici.
   * @param {string} title - Titolo del libro.
   * @returns {string} - Slug generato.
   */
  const generateSlug = (title) => {
    return title
      .toLowerCase()       // Converti tutto in minuscolo
      .replace(/\s+/g, "-") // Sostituisci gli spazi con "-"
      .replace(/[^\w-]+/g, ""); // Rimuovi caratteri speciali
  };

  // Quando la pagina viene caricata, scrolla automaticamente in cima
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <section className="wishlist new-container">
      <h1>La tua Wishlist</h1>
      {error && <p>Errore: {error}</p>}
      {wishlist.length > 0 ? (
        <div className="wishlist-items">
          {wishlist.map((book, index) => (
            <div key={index} className="book-card-wishlist">
              <Link
                to={`/books/${generateSlug(book.title)}`}
                className="book-wishlist"
              >
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
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(book.id);
                          }}
                          className="remove-btn"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="info-book">
                      <p className="description">{book.description}</p>
                      <div className="prova">
                        <div className="search-buy-detail"></div>

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
                              <span className="final-price">{book.value}€</span>
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
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-result-wishlist">
          È veramente vuoto qui. Aggiungi un libro ai preferiti.
        </p>
      )}
    </section>
  );
}
