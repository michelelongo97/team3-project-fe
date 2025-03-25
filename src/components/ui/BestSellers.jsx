import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../../context/WishlistContext";
import { useAlertContext } from "../../context/AlertContext";
import axios from "../../api/axios";

export default function BestSellers({ addToCart }) {
  // Recupera lo stato della wishlist e le funzioni per aggiornarla dal contesto
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  const { setAlert } = useAlertContext();

  // Stato per memorizzare i dati dei best seller e gestire eventuali errori
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Riferimento per lo slider della lista dei best seller
  const sliderRef = useRef(null);

  // Sincronizza la wishlist al montaggio del componente
  useEffect(() => {
    syncWishlist();
  }, []);

  // Funzione per recuperare i best seller dal server
  const fetchBestSellers = () => {
    axios
      .get("/books/best-sellers")
      .then((res) => {
        setData(res.data); // Aggiorna lo stato con i dati ricevuti
      })
      .catch((error) => {
        setError(error.message); // Salva l'errore nello stato
        console.error("Errore nell'ottenere i libri più venduti:", error);
      });
  };

  // Effettua la chiamata API quando il componente viene montato
  useEffect(() => {
    fetchBestSellers();
  }, []);

  // Funzione per scorrere la lista dei best seller lateralmente
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Distanza di scorrimento
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth", // Scorrimento fluido
      });
    }
  };

  // Genera uno slug dal titolo di un libro per URL leggibili
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-") // Sostituisce gli spazi con trattini
      .replace(/[^\w-]+/g, ""); // Rimuove caratteri non alfanumerici
  };

  // Aggiunge un libro al carrello e mostra un avviso di conferma
  const handleAddToCart = (book) => {
    addToCart(book);

    setAlert({
      type: "success",
      message: "Articolo aggiunto al carrello",
    });
  };

  return (
    <section>
      <div className="title-last-container">
        <h1 className="title-last">I NOSTRI BESTSELLER</h1>
      </div>
      {error && <p className="error-message">Errore: {error}</p>}
      {data.length > 0 ? (
        <div className="slider-wrapper row-x">
          <button className="slider-btn btn-left" onClick={() => scroll(-1)}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="slider-track" ref={sliderRef}>
            {data.map((book) => (
              <div key={book.id} className="slider-item">
                <Link
                  to={`/books/${generateSlug(book.title)}`}
                  className="book-card"
                >
                  <img src={book.image} alt={book.title} />
                  <h4 className="book-title">{book.title}</h4>
                  {book.discountId &&
                  new Date() >= new Date(book.start_date) &&
                  new Date() <= new Date(book.end_date) ? (
                    book.discount_type === "percentage" ? (
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
                      <div>
                        <span className="old-price">{book.price}€</span>
                        <div>
                          <span>{book.value}€</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="book-price">{book.price}€</p>
                  )}
                  <div className="add-book">
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
          <button className="slider-btn btn-right" onClick={() => scroll(1)}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      ) : (
        <p>Nessun bestseller disponibile</p>
      )}
    </section>
  );
}
