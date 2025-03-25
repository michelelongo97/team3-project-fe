import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../context/WishlistContext";

export default function Cart({ cartItems, setCartItems }) {
  // Stato per gestire i messaggi di errore o successo
  const [message, setMessage] = useState("");

  // Otteniamo la wishlist e la funzione per aggiungere/rimuovere elementi dalla wishlist
  const { wishlist, toggleWishlist } = useWishlistContext();

  // Variabile per eventuali sconti (al momento non utilizzata)
  let discount = 0;

  // Funzione per calcolare il totale del carrello
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Funzione per recuperare il carrello dal server
  const fetchCart = async () => {
    try {
      const response = await axios.get("/cart"); // Chiamata API per ottenere il carrello
      setCartItems(response.data.cart); // Aggiorniamo lo stato del carrello con i dati ricevuti
      setMessage(response.data.message || "Carrello recuperato con successo.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Errore durante il recupero del carrello."
      );
    }
  };

  console.log(cartItems); // Debug: stampa i dati del carrello nella console

  // Funzione per rimuovere un articolo dal carrello
  const removeFromCart = async (book_id, quantity) => {
    try {
      await axios.delete(`/cart/remove/${book_id}/${quantity}`); // Chiamata API per rimuovere l'articolo
      setMessage("Articolo rimosso dal carrello.");
      fetchCart(); // Aggiorniamo il carrello dopo la rimozione
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Errore durante la rimozione dell'articolo."
      );
    }
  };

  // Funzione per aggiornare la quantità di un articolo nel carrello
  const updateQuantity = async (bookId, newQuantity) => {
    try {
      await axios.put("/cart/update-quantity", {
        book_id: bookId,
        quantity: newQuantity,
      });
      setMessage("Quantità aggiornata con successo.");
      fetchCart(); // Aggiorniamo il carrello dopo la modifica della quantità
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Errore durante l'aggiornamento della quantità."
      );
    }
  };

  // Aumenta la quantità di un articolo
  const handleIncrement = (bookId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(bookId, newQuantity);
  };

  // Diminuisce la quantità di un articolo (fino a un minimo di 1)
  const handleDecrement = (bookId, currentQuantity) => {
    const newQuantity = currentQuantity - 1;
    if (newQuantity >= 1) {
      updateQuantity(bookId, newQuantity);
    } else {
      setMessage("La quantità non può essere inferiore a 1.");
    }
  };

  // Recuperiamo il carrello quando il componente viene montato
  useEffect(() => {
    fetchCart();
  }, []);

  // Scorriamo la pagina all'inizio quando il componente viene caricato
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Il tuo carrello</h1>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Il tuo carrello è vuoto</p>
            <Link to="/">
              <button className="continue-shopping-btn">
                Continua lo shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.book_id}>
                <div className="item-details">
                  <div className="cart-image-container">
                    <img
                      src={item.image}
                      alt={item.book_title}
                      className="item-image"
                    />
                  </div>
                  <div className="item-info">
                    <h3 className="item-title">{item.book_title}</h3>
                    <p>
                      di{" "}
                      <strong className="item-author"> {item.author} </strong>{" "}
                    </p>
                    <p className="available_quantity">
                      Quantità disponibile : {item.available_quantity} pezzi.
                    </p>
                    {item.available_quantity > 0 ? (
                      <p className="availability">
                        <i className="fa-solid fa-circle-check"></i>{" "}
                        Disponibilità immediata
                      </p>
                    ) : (
                      <p className="out-of-stock">
                        <i class="fa-solid fa-circle-xmark"></i> Al momento non
                        disponibile
                      </p>
                    )}
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">
                    <h4 className="discount-description">{item.description}</h4>
                    <h3 className={`${item.value && "price-deprecated"}`}>
                      {item.price}€
                    </h3>

                    <h3 className="cart-discount-price">
                      {" "}
                      {item.discount_type === "percentage" && item.value
                        ? `${(
                            item.price -
                            (item.price * item.value) / 100
                          ).toFixed(2)}€`
                        : item.discount_type === "fixed" && item.value
                        ? `${Math.max(0, item.value)}€`
                        : ""}
                    </h3>
                  </div>
                  <div className="cart-item-button">
                    <div className="cart-item-button-increment-decrement">
                      {item.quantity === 1 ? (
                        <button
                          disabled
                          onClick={() =>
                            handleDecrement(item.book_id, item.quantity)
                          }
                          className="quantity-btn"
                        >
                          -
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleDecrement(item.book_id, item.quantity)
                          }
                          className="quantity-btn"
                        >
                          -
                        </button>
                      )}

                      <p>{item.quantity}</p>

                      <button
                        onClick={() =>
                          handleIncrement(item.book_id, item.quantity)
                        }
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-button-remove">
                      <button
                        onClick={() => toggleWishlist(item.book_id)}
                        className="wishlist-btn"
                      >
                        <i
                          className={
                            wishlist.some((book) => book.id === item.book_id)
                              ? "fa-solid fa-heart"
                              : "fa-regular fa-heart"
                          }
                        ></i>
                      </button>
                      <button
                        onClick={() =>
                          removeFromCart(item.book_id, item.quantity)
                        }
                        className="remove-btn"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="cart-summary">
          <div className="cart-total">
            <span>Totale:</span>
            <span className="total-amount">
              {cartItems.length > 0
                ? cartItems
                    .reduce((acc, item) => {
                      const discount =
                        item.discount_type === "percentage" && item.value
                          ? item.price * (item.value / 100)
                          : item.discount_type === "fixed" && item.value
                          ? Math.min(item.price, item.value)
                          : 0;
                      return acc + (item.price - discount) * item.quantity;
                    }, 0)
                    .toFixed(2)
                : "0.00"}
              €
            </span>
          </div>
          {cartItems.length > 0 ? (
            <Link to="/checkout" state={{ cartItems }} className="checkout-btn">
              Acquista ora
            </Link>
          ) : (
            <button className="checkout-btn disabled" disabled>
              Carrello vuoto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
