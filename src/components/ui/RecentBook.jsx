import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../../context/WishlistContext";
import { useAlertContext } from "../../context/AlertContext";
import axios from "../../api/axios";

export default function RecentBook({ addToCart }) {
  // Recupera lo stato della wishlist e le funzioni per aggiornarla dal contesto
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  const { setAlert } = useAlertContext();

  // Stato per contenere i dati dei libri più recenti e gli eventuali errori
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Riferimento per lo slider dei libri
  const sliderRef = useRef(null);

  // Sincronizza la wishlist al montaggio del componente
  useEffect(() => {
    syncWishlist();
  }, []);

  // Funzione per ottenere i libri più recenti dal server
  const fetchBooks = () => {
    axios
      .get("/books") // Chiamata API per ottenere i libri
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Errore nell'ottenere i libri:", error);
      });
  };

  // Esegue il fetch dei libri una volta al montaggio del componente
  useEffect(() => {
    fetchBooks();
  }, []);

  // Funzione per scorrere lo slider a sinistra o a destra
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Quantità di scroll in pixel
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth", // Animazione fluida
      });
    }
  };

  // Funzione per generare uno slug dal titolo del libro (utile per gli URL)
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-") // Sostituisce gli spazi con trattini
      .replace(/[^\w-]+/g, ""); // Rimuove caratteri non alfanumerici
  };

  // Funzione per aggiungere un libro al carrello e mostrare un avviso
  const handleAddToCart = (book) => {
    addToCart(book);
    setAlert({
      type: "success",
      message: "Articolo aggiunto al carrello",
    });
  };

  return (
    <section>
      {/* Titolo della sezione */}
      <div className="title-last-container">
        <h1 className="title-last">I NOSTRI LIBRI PIÙ RECENTI</h1>
      </div>

      {/* Mostra un messaggio di errore in caso di problemi nel fetch */}
      {error && <p className="error-message">Errore: {error}</p>}

      {/* Controlla se ci sono dati da mostrare */}
      {data.length > 0 ? (
        <div className="slider-wrapper row-x">
          {/* Pulsante per scorrere a sinistra */}
          <button className="slider-btn btn-left" onClick={() => scroll(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          {/* Contenitore dello slider */}
          <div className="slider-track" ref={sliderRef}>
            {data.map((book) => (
              <div key={book.id} className="slider-item">
                {/* Link alla pagina del libro */}
                <Link
                  to={`/books/${generateSlug(book.title)}`}
                  className="book-card"
                >
                  {/* Immagine del libro */}
                  <img src={book.image} alt={book.title} />

                  {/* Titolo del libro */}
                  <h4 className="book-title">{book.title}</h4>

                  {/* Prezzo con eventuale sconto */}
                  {book.discountId &&
                  new Date() >= new Date(book.start_date) &&
                  new Date() <= new Date(book.end_date) ? (
                    book.discount_type === "percentage" ? (
                      <div>
                        {/* Prezzo originale barrato */}
                        <span className="old-price">{book.price}€</span>
                        <div>
                          {/* Prezzo scontato calcolato con la percentuale */}
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
                      <div>
                        {/* Prezzo originale barrato */}
                        <span className="old-price">{book.price}€</span>
                        <div>
                          {/* Prezzo scontato fisso */}
                          <span>{book.value}€</span>
                        </div>
                      </div>
                    )
                  ) : (
                    // Prezzo senza sconto
                    <p className="book-price">{book.price}€</p>
                  )}

                  {/* Pulsanti per wishlist e carrello */}
                  <div className="add-book">
                    {/* Pulsante per aggiungere/rimuovere dalla wishlist */}
                    <button
                      className="wishlist-button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(book.id);
                      }}
                    >
                      {wishlist.some((b) => b.id === book.id) ? (
                        <i className="fa-solid fa-heart"></i> // Cuore pieno se è nella wishlist
                      ) : (
                        <i className="fa-regular fa-heart"></i> // Cuore vuoto se non è nella wishlist
                      )}
                    </button>

                    {/* Pulsante per aggiungere al carrello */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(book);
                      }}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pulsante per scorrere a destra */}
          <button className="slider-btn btn-right" onClick={() => scroll(1)}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      ) : (
        // Messaggio in caso di assenza di dati
        <p>Nessun elemento disponibile</p>
      )}
    </section>
  );
}
