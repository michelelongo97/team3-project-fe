import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";

export default function Checkout() {
  const location = useLocation();
  // Recupera cartItems 
  const cartItems = location.state?.cartItems || []; 

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

    // Calcola il totale considerando gli sconti
    const total_price = cartItems.reduce((total, item) => {
      // Prezzo base senza sconto
      let finalPrice = item.price; 

      // Applica gli sconti
      if (item.discount_type === "percentage" && item.value) {
        finalPrice = (item.price - item.price * item.value / 100).toFixed(2); // Sconto percentuale
      } else if (item.discount_type === "fixed" && item.value) {
        finalPrice = Math.max(0, item.value); 
      }

      // Aggiungi il prezzo totale scontato moltiplicato per la quantità
      return total + finalPrice * item.quantity;
    }, 0);

    // Calcola il costo di spedizione
    const shipment_cost = total_price > 50 ? 0 : 4.99; // Spedizione gratuita sopra 50€

    setLoading(true);
    try {
      // Invio dei dati al backend
      const response = await axios.post("/sales", {
        ...formData,
        total_price,
        shipment_cost,
      });

      alert(`Ordine completato con successo! Numero ordine: ${response.data.order_number}`);
    } catch (error) {
      console.error("Errore durante il checkout:", error.response?.data?.message || error.message);
      alert("C'è stato un problema con il checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    // Messaggio se il carrello è vuoto
    return <p>Il carrello è vuoto. Torna al carrello per aggiungere articoli.</p>;
  }

  return (
    <div className="checkout-container">
      <div className="cart-details">
        <h2>Riepilogo del Carrello</h2>
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
              // Calcola il prezzo finale tenendo conto degli sconti
               // Prezzo di base senza sconto
              let discountedPrice = item.price;
              if (item.discount_type === "percentage" && item.value) {
                // Sconto percentuale
                discountedPrice = (item.price - item.price * item.value / 100).toFixed(2); 
              } else if (item.discount_type === "fixed" && item.value) {
                // Sconto fisso
                discountedPrice = Math.max(0, item.value); 
              }

              return (
                <tr key={item.book_id}>
                  <td>{item.book_title}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}€</td>
                  
                  <td>{item.description || "Nessuno sconto"}</td>
                  { item.discount_type === null ?  <td>0.00€</td> : <td>{discountedPrice}€</td>}
                  
                  <td>{(discountedPrice * item.quantity).toFixed(2)}€</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h1>Completa il Checkout</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Cognome"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefono"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="shipment_address"
          placeholder="Indirizzo di Spedizione"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="billing_address"
          placeholder="Indirizzo di Fatturazione"
          onChange={handleChange}
          required
        />
        <div className="checkout-summary">
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
                discountedPrice = Math.max(0,  item.value);
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
