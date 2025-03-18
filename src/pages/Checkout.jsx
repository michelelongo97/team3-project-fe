import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";

export default function Checkout() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []); // Aggiunto useState per svuotare il carrello

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    shipment_address: "",
    billing_address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total_price = cartItems.reduce((total, item) => {
      let finalPrice = item.price;

      if (item.discount_type === "percentage" && item.value) {
        finalPrice = (item.price - item.price * item.value / 100).toFixed(2);
      } else if (item.discount_type === "fixed" && item.value) {
        finalPrice = Math.max(0, item.value);
      }

      return total + finalPrice * item.quantity;
    }, 0);

    const shipment_cost = total_price > 50 ? 0 : 4.99;

    setLoading(true);
    try {
      const response = await axios.post("/sales", {
        ...formData,
        total_price,
        shipment_cost,
      });

      alert(
        `Ordine completato con successo! Numero ordine: ${response.data.order_number}`
      );

      // Svuota i campi del modulo
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        shipment_address: "",
        billing_address: "",
      });

      // Svuota il carrello (tabella)
      setCartItems([]);
    } catch (error) {
      console.error(
        "Errore durante il checkout:",
        error.response?.data?.message || error.message
      );
      alert("C'è stato un problema con il checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return <p className="checkout-empty-cart-message">Il carrello è vuoto. Torna al carrello per aggiungere articoli.</p>;
  }

  return (
    <div className="checkout-container-wrapper">
      <div className="checkout-cart-table-wrapper">
        <h2 className="checkout-header">Riepilogo del Carrello</h2>
        <table>
          <thead>
            <tr>
              <th>Titolo</th>
              <th>Quantità</th>
              <th>Prezzo Unitario</th>
              <th>Sconto</th>
              <th>Prezzo Scontato</th>
              <th>Totale</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              let discountedPrice = item.price;
              if (item.discount_type === "percentage" && item.value) {
                discountedPrice = (item.price - item.price * item.value / 100).toFixed(2);
              } else if (item.discount_type === "fixed" && item.value) {
                discountedPrice = Math.max(0, item.value);
              }

              return (
                <tr key={item.book_id}>
                  <td>{item.book_title}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}€</td>
                  <td>{item.description || "Nessuno sconto"}</td>
                  {item.discount_type === null ? <td>0.00€</td> : <td>{discountedPrice}€</td>}
                  <td>{(discountedPrice * item.quantity).toFixed(2)}€</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h1 className="checkout-header">Completa il Checkout</h1>
      <form className="checkout-form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Nome"
          onChange={handleChange}
          value={formData.first_name} // Gestione del valore
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Cognome"
          onChange={handleChange}
          value={formData.last_name} // Gestione del valore
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email} // Gestione del valore
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefono"
          onChange={handleChange}
          value={formData.phone} // Gestione del valore
          required
        />
        <input
          type="text"
          name="shipment_address"
          placeholder="Indirizzo di Spedizione"
          onChange={handleChange}
          value={formData.shipment_address} // Gestione del valore
          required
        />
        <input
          type="text"
          name="billing_address"
          placeholder="Indirizzo di Fatturazione"
          onChange={handleChange}
          value={formData.billing_address} // Gestione del valore
          required
        />
        <div className="checkout-summary-container">
          <p>
            Subtotale: €
            {cartItems.reduce((total, item) => {
              let discountedPrice = item.price;
              if (item.discount_type === "percentage" && item.value) {
                discountedPrice = item.price - (item.price * item.value / 100);
              } else if (item.discount_type === "fixed" && item.value) {
                discountedPrice = Math.max(0, item.value);
              }
              return total + discountedPrice * item.quantity;
            }, 0).toFixed(2)}
          </p>
          <p>
            Spedizione: €
            {cartItems.reduce((total, item) => {
              let discountedPrice = item.price;
              if (item.discount_type === "percentage" && item.value) {
                discountedPrice = (item.price - item.price * item.value / 100).toFixed(2);
              } else if (item.discount_type === "fixed" && item.value) {
                discountedPrice = Math.max(0, item.value);
              }
              return total + discountedPrice * item.quantity;
            }, 0) > 50
              ? "0.00"
              : "4.99"}
          </p>
          <p>
            Totale ordine (con spedizione): €
            {(
              cartItems.reduce((total, item) => {
                let discountedPrice = item.price;
                if (item.discount_type === "percentage" && item.value) {
                  discountedPrice = (item.price - item.price * item.value / 100).toFixed(2);
                } else if (item.discount_type === "fixed" && item.value) {
                  discountedPrice = Math.max(0, item.value);
                }
                return total + discountedPrice * item.quantity;
              }, 0) +
              (cartItems.reduce((total, item) => {
                let discountedPrice = item.price;
                if (item.discount_type === "percentage" && item.value) {
                  discountedPrice =
                  (item.price - item.price * item.value / 100).toFixed(2);
                } else if (item.discount_type === "fixed" && item.value) {
                  discountedPrice = Math.max(0, item.value);
                }
                return total + discountedPrice * item.quantity;
              }, 0 ) > 50
                ? 0
                : 4.99)
            ).toFixed(2)}
          </p>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Elaborazione in corso..." : "Conferma Ordine"}
        </button>
      </form>
    </div>
  );
}
