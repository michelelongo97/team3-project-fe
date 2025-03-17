import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, error, toggleWishlist, syncWishlist } =
    useWishlistContext();
  useEffect(() => {
    syncWishlist();
  }, []);
  //slug
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };
  return (
    <section className="wishlist">
      <h1>La tua Wishlist</h1>
      {error && <p>Errore: {error}</p>}
      {wishlist.length > 0 ? (
        <div className="wishlist-items">
          {wishlist.map((book, index) => (
            <div key={index} className="book-card">
              <Link
                to={`/books/${generateSlug(book.title)}`}
                className="book-card-link"
              >
                <img src={book.image} alt={book.title} />
                <h4>{book.title}</h4>
                <p>{book.price}€</p>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(book.id);
                }}
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
