import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWishlistContext } from "../../context/WishlistContext";
import { useAlertContext } from "../../context/AlertContext";
import axios from "../../api/axios";

export default function BookCard({ title, image, author, price, id }) {
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  const { setAlert } = useAlertContext();
  const [message, setMessage] = useState("");

  useEffect(() => {
    syncWishlist();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //Carrello
  const addToCart = () => {
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
  return (
    <div className="book-relate-container">
      <div className="book-relate-card">
        <Link to={`/books/${generateSlug(title)}`} className="book-relate-link">
          <img src={image} alt={title} className="book-relate-image" />
          <h3 className="book-relate-title">{title}</h3>
          <p className="book-relate-author">{author}</p>
          <p className="book-relate-price">{price}€</p>
          <div className="add-book">
            <button
              className="wishlist-button"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(id);
              }}
            >
              {wishlist.some((b) => b.id === id) ? (
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
    </div>
  );
}
