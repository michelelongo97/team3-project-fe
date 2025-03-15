import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios"; // Assicurati di configurare correttamente axios

export default function WishlistPage() {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Funzione per ottenere l'ID dell'utente
  const fetchUserId = () => {
    axios
      .get("/wishlist/get-user-id")
      .then((res) => {
        setUserId(res.data.user_id);
      })
      .catch((error) => {
        console.error("Errore nel recupero dell'user_id:", error);
      });
  };

  // Funzione per ottenere i libri della wishlist
  const fetchWishlistBooks = () => {
    if (userId) {
      axios
        .get(`/wishlist/${userId}`)
        .then((res) => {
          setWishlistBooks(res.data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };
  // Funzione per rimuovere un libro dalla wishlist
  const removeFromWishlist = (bookId) => {
    axios
      .delete("/wishlist", { data: { user_id: userId, book_id: bookId } })
      .then((response) => {
        console.log("Libro rimosso dalla wishlist:", response.data);
        // Rimuovi il libro dalla lista visualizzata
        const newWishlist = wishlistBooks.filter((book) => book.id !== bookId);
        setWishlistBooks(newWishlist);
        // Salva la nuova wishlist nel localStorage
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        // Notifica gli altri componenti che la wishlist è cambiata
        window.dispatchEvent(new Event("wishlistUpdated"));
      })
      .catch((error) => {
        console.error("Errore nella rimozione del libro:", error);
      });
  };
  useEffect(() => {
    fetchUserId(); // Ottieni l'userId quando il componente viene caricato
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWishlistBooks(); // Ottieni i libri della wishlist
    }
  }, [userId]);

  return (
    <section className="wishlist">
      <h1>La tua Wishlist</h1>
      {error && <p>Errore: {error}</p>}
      {wishlistBooks.length > 0 ? (
        <div className="wishlist-items">
          {wishlistBooks.map((book, index) => (
            <div key={index} className="book-card">
              <Link to={`/books/${book.id}`} className="book-card-link">
                <img src={book.image} alt={book.title} />
                <h4>{book.title}</h4>
                <p>{book.price}€</p>
              </Link>
              <button
                onClick={() => removeFromWishlist(book.id)}
                className="remove-btn"
              >
                ❌ Rimuovi
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>La tua wishlist è vuota.</p>
      )}
    </section>
  );
}
