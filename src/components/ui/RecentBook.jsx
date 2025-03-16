import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

export default function RecentBook() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const sliderRef = useRef(null);

  // Funzione per ottenere l'ID utente
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

  // Funzione per ottenere i libri
  const fetchBooks = () => {
    axios
      .get("/books")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Errore nell'ottenere i libri:", error);
      });
  };

  // Funzione per ottenere la wishlist
  const fetchWishlist = () => {
    if (!userId) return;
    axios
      .get(`/wishlist/${userId}`)
      .then((res) => {
        const wishlistIds = res.data.map((book) => book.id);
        setWishlist(wishlistIds);
        localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
      })
      .catch((error) => {
        console.error("Errore nel recupero della wishlist:", error);
      });
  };

  useEffect(() => {
    fetchUserId();
    fetchBooks();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  // Gestisce l'aggiornamento della wishlist quando cambia il localStorage
  useEffect(() => {
    const updateWishlist = () => {
      setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    };

    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);

  // Funzione per aggiungere/rimuovere un libro dalla wishlist
  const toggleWishlist = (bookId) => {
    if (!userId) {
      console.error("User ID non trovato.");
      return;
    }

    let newWishlist = [...wishlist];

    if (wishlist.includes(bookId)) {
      newWishlist = newWishlist.filter((id) => id !== bookId);
      axios
        .delete("/wishlist", { data: { user_id: userId, book_id: bookId } })
        .then(() => {
          setWishlist(newWishlist);
          localStorage.setItem("wishlist", JSON.stringify(newWishlist));
          window.dispatchEvent(new Event("wishlistUpdated"));
        })
        .catch((error) => {
          console.error("Errore nella rimozione dalla wishlist:", error);
        });
    } else {
      newWishlist.push(bookId);
      axios
        .post("/wishlist", { user_id: userId, book_id: bookId })
        .then(() => {
          setWishlist(newWishlist);
          localStorage.setItem("wishlist", JSON.stringify(newWishlist));
          window.dispatchEvent(new Event("wishlistUpdated"));
        })
        .catch((error) => {
          console.error("Errore nell'aggiungere alla wishlist:", error);
        });
    }
  };
  // Funzione per lo scrolling orizzontale
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
  return (
    <section className="last">
      <h1 className="title-last">PIÙ RECENTI</h1>
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
                  <button
                    className="wishlist-button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(book.id);
                    }}
                  >
                    {wishlist.includes(book.id) ? (
                      <i className="fa-solid fa-heart"></i>
                    ) : (
                      <i className="fa-regular fa-heart"></i>
                    )}
                  </button>
                </Link>
              </div>
            ))}
          </div>
          <button className="slider-btn btn-right" onClick={() => scroll(1)}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      ) : (
        <p>Nessun elemento disponibile</p>
      )}
    </section>
  );
}
