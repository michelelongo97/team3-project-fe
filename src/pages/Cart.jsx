import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get("/cart"); // Chiamata GET al backend
      setCartItems(response.data.cart); // Imposta gli articoli nel carrello
      setMessage(response.data.message || "Carrello recuperato con successo.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Errore durante il recupero del carrello."
      );
    }
  };

  const removeFromCart = async (book_id, quantity) => {
    try {
      await axios.delete(`/cart/remove/${book_id}/ ${quantity}`);
      setMessage("Articolo rimosso dal carrello.");
      fetchCart();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Errore durante la rimozione dell'articolo."
      );
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    try {
      await axios.put("/cart/update-quantity", {
        book_id: bookId,
        quantity: newQuantity, // Invia il nuovo valore
      });
      setMessage("Quantità aggiornata con successo.");
      fetchCart(); // Aggiorna il carrello
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Errore durante l'aggiornamento della quantità."
      );
    }
  };

  const handleIncrement = (bookId, currentQuantity) => {
    const newQuantity = currentQuantity + 1; // Incrementa
    updateQuantity(bookId, newQuantity);
  };

  const handleDecrement = (bookId, currentQuantity) => {
    const newQuantity = currentQuantity - 1; // Decrementa
    if (newQuantity >= 1) {
      updateQuantity(bookId, newQuantity);
    } else {
      setMessage("La quantità non può essere inferiore a 1.");
    }
  };

  useEffect(() => {
    fetchCart();
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
                  <div className="item-info">
                    <img
                      src={item.image}
                      alt={item.book_title}
                      className="item-image"
                    />

                    <h3 className="item-title">{item.book_title}</h3>
                    <p className="item-price">{item.price}</p>
                  </div>
                </div>
                <div className="item-actions">
                  <div className="item-button-add-remove">
                    <button
                      onClick={() =>
                        handleDecrement(item.book_id, item.quantity)
                      }
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleIncrement(item.book_id, item.quantity)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.book_id, item.quantity)}
                    className="remove-btn"
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="cart-summary">
          <div className="cart-total">
            <span>Totale:</span>
            <span className="total-amount">{calculateTotal().toFixed(2)}</span>
          </div>
          {cartItems.length > 0 ? (
          <Link to="/checkout" state={{ cartItems }} className="checkout-btn">
          Procedi all'acquisto
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
