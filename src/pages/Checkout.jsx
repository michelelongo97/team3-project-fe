import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";

export default function Checkout() {
  const location = useLocation();
  const cartItems = location.state?.cartItems || []; // Recupera cartItems o fallback a un array vuoto

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    shipment_address: "",
    billing_address: "",
  });
  const [loading, setLoading] = useState(false); // Stato di caricamento

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total_price = cartItems.reduce((total, item) => total + item.price * item.quantity, 0); // Calcola il totale

    setLoading(true); 
    try {
      // Invio dei dati al backend
      const response = await axios.post("/sales", {
        ...formData,
        total_price,
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
            Totale ordine: €
            {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Elaborazione in corso..." : "Conferma Ordine"}
        </button>
      </form>
    </div>
  );
}
