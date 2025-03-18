import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../../context/WishlistContext";
import axios from "../../api/axios";

export default function BestSellers() {
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    syncWishlist();
  }, []);

  const fetchBestSellers = () => {
    axios
      .get("/books/best-sellers")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Errore nell ottenere i libri più venduti:", error);
      });
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const addToCart = (book) => {
    axios
      .post("/cart", {
        id: book.id,
        quantity: 1,
      })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
            "Errore durante l'aggiunta al carrello."
        );
      });
  };

  return (
    <section className="best-sellers">
      <h1 className="title-last">I NOSTRI BESTSELLER</h1>
      {error && <p className="error-message">Errore: {error}</p>}
      {data.length > 0 ? (
        <div className="slider-wrapper">
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
                  <h4>{book.title}</h4>
                  <p className="book-price">{book.price}€</p>
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
                        addToCart(book);
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
