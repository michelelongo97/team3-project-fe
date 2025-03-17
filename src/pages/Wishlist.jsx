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
                    <div className="search-book-info">
                      <div>{book.description}</div>
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
                              <span className="final-price">{book.value}€</span>
                            </div>
                          )
                        ) : (
                          <p className="search-book-price">{book.price}€</p>
                        )}
                        <button className="search-buy-button">
                          🛒 Aggiungi al Carrello
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
        <p>La tua wishlist è vuota.</p>
      )}
    </section>
  );
}
