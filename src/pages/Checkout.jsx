import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAlertContext } from "../context/AlertContext";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAlert } = useAlertContext();

  // Stato che memorizza gli articoli presenti nel carrello,
  // prendendoli dallo stato passato dalla pagina precedente (se disponibile).
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);

  // Stato che gestisce la visibilità del form di checkout
  const [formVisible, setFormVisible] = useState(false);

  // Stato che memorizza i dati inseriti nel form dall'utente
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    shipment_address: "",
    billing_address: "",
  });

  // Stato che memorizza i dettagli dell'indirizzo di spedizione
  const [shipmentDetails, setShipmentDetails] = useState({
    street: "",
    house_number: "",
    city: "",
    zip_code: "",
    province: "",
  });

  // Stato che memorizza i dettagli dell'indirizzo di fatturazione
  const [billingDetails, setBillingDetails] = useState({
    street: "",
    house_number: "",
    city: "",
    zip_code: "",
    province: "",
  });

  // Stato per memorizzare eventuali errori di validazione nei campi del form
  const [errors, setErrors] = useState({});

  // Stato per gestire se l'utente vuole usare lo stesso indirizzo di spedizione anche per la fatturazione
  const [useSameAddress, setUseSameAddress] = useState(false);

  // Stato per indicare se il form sta elaborando un'operazione
  const [loading, setLoading] = useState(false);

  // Stato per tenere traccia di tutti gli errori del form
  const [formErrors, setFormErrors] = useState({});

  /**
   * Funzione per validare i singoli campi del form
   * @param {string} fieldName - Il nome del campo da validare
   * @param {string} value - Il valore inserito dall'utente
   * @returns {string} - Il messaggio di errore se il valore non è valido, altrimenti stringa vuota
   */
  const validateField = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "first_name":
      case "last_name":
        // Nome e cognome devono contenere almeno 2 caratteri
        if (value.trim().length < 2) {
          error = `${
            fieldName === "first_name" ? "Il nome" : "Il cognome"
          } deve avere almeno 2 caratteri.`;
        }
        break;

      case "email":
        // Controlla che l'email sia in un formato valido
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Inserisci un'email valida (esempio@email.com).";
        }
        break;

      case "phone":
        // Rimuove gli spazi e verifica che ci siano almeno 9 cifre consecutive
        if (!/^\d{9,}$/.test(value?.toString().replace(/\s+/g, ""))) {
          error =
            "Il numero di telefono deve contenere almeno 9 cifre consecutive.";
        }
        break;

      case "street":
        // La via deve avere almeno 5 caratteri
        if (value.trim().length < 5) {
          error = "La via deve avere almeno 5 caratteri.";
        }
        break;

      case "house_number":
        // Il numero civico deve essere un numero
        if (!/^\d+$/.test(value)) {
          error = "Il numero civico deve essere un valore numerico.";
        }
        break;

      case "city":
        // La città deve avere almeno 2 caratteri
        if (value.trim().length < 2) {
          error = "La città deve avere almeno 2 caratteri.";
        }
        break;

      case "province":
        // La provincia deve essere scritta per intero (es. "Milano")
        if (value.trim().length < 4) {
          error =
            "La provincia deve essere scritta per intero (esempio: Milano).";
        }
        break;

      default:
        break;
    }
    return error;
  };

  /**
   * Funzione che controlla tutti i campi del form e restituisce un oggetto con gli errori
   * @param {Object} formData - I dati del form da validare
   * @returns {Object} - Oggetto contenente eventuali errori di validazione
   */
  const validateForm = (formData) => {
    const errors = {};

    // Esegue la validazione su ogni campo del form
    Object.keys(formData).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        errors[fieldName] = error; // Salva l'errore nel campo corrispondente
      }
    });

    return errors;
  };

  /**
   * Gestisce l'invio del form
   * Controlla se ci sono errori e, in caso positivo, mostra un messaggio di avviso.
   * Se non ci sono errori, invia i dati al server e svuota il carrello.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Esegue la validazione dell'intero form
    const errors = validateForm(formData);

    // Se ci sono errori, mostra un avviso e non procede con l'invio
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setAlert({
        type: "danger",
        message: "Completa tutti i campi correttamente!",
      });
      return;
    }

    console.log("Form inviato con successo!", formData);
    setAlert({
      type: "success",
      message: "Ordine completato con successo!",
    });

    setLoading(true);

    try {
      // Simula la chiamata al server per completare l'ordine
      await axios.post("/sales", {
        ...formData,
        total_price: subtotal + shippingCost,
        shipment_cost: shippingCost,
      });

      // Mostra un messaggio di conferma all'utente
      setAlert({
        type: "success",
        message:
          "Grazie per il tuo ordine! A breve riceverai un'email con i dettagli.",
      });

      // Svuota il carrello e i campi del form
      setCartItems([]);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        shipment_address: "",
        billing_address: "",
      });

      setShipmentDetails({
        street: "",
        house_number: "",
        city: "",
        zip_code: "",
        province: "",
      });

      setBillingDetails({
        street: "",
        house_number: "",
        city: "",
        zip_code: "",
        province: "",
      });

      // Nasconde il form dopo la conferma
      setFormVisible(false);

      // Reindirizza l'utente al carrello dopo l'acquisto
      navigate("/cart");
    } catch (error) {
      console.error("Errore durante il checkout:", error);
      setAlert({
        type: "danger",
        message: "Si è verificato un errore durante il checkout!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`checkout-container ${formVisible ? "show-form" : ""}`}>
      {/* Overlay per il form */}
      {formVisible && (
        <div
          className="checkout-overlay"
          onClick={() => setFormVisible(false)} // Nasconde il form al clic sull'overlay
        ></div>
      )}

      {/* Colonna sinistra: dettagli libri */}
      <div className="books-details">
        <div className="checkout-title-page">
          <h1>Il tuo ordine </h1>
        </div>
        {cartItems.map((item) => {
          let discountedPrice = item.price;

          if (item.discount_type === "percentage" && item.value) {
            discountedPrice = item.price - (item.price * item.value) / 100;
          } else if (item.discount_type === "fixed" && item.value) {
            discountedPrice = Math.max(0, item.value);
          }

          return (
            <div key={item.book_id} className="book-item">
              <img
                src={item.image}
                alt={item.book_title}
                className="book-image"
              />
              <div className="book-info">
                <div className="checkout-card-details">
                  <h4>{item.book_title}</h4>
                  <h6>Quantità:</h6>
                  <p>{item.description || ""}</p>
                </div>
                <div className="checkout-card-info">
                  <p>
                    <span
                      className={`book-price ${
                        item.discount_type && "price-deprecated"
                      }`}
                    >
                      {item.price}€
                    </span>
                  </p>
                  <p>({item.quantity})</p>
                  <p className="discounted-price">
                    {item.discount_type && discountedPrice !== item.price
                      ? ` ${discountedPrice.toFixed(2)}€`
                      : null}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Colonna destra: riepilogo ordine */}
      <div className="order-summary">
        <h2 className="checkout-header">Riepilogo Ordine</h2>
        <div className="order-items">
          {cartItems.map((item) => {
            let discountedPrice = item.price;

            if (item.discount_type === "percentage" && item.value) {
              discountedPrice = (
                item.price -
                (item.price * item.value) / 100
              ).toFixed(2);
            } else if (item.discount_type === "fixed" && item.value) {
              discountedPrice = Math.max(0, item.value);
            }

            return (
              <div key={item.book_id} className="order-item">
                <p className="title">
                  <strong>{item.book_title}</strong>
                </p>
                <p>Quantità: {item.quantity}</p>
                <p>Prezzo: {item.price}€</p>
                {item.description && <p>{item.description}</p>}
                {item.discount_type ? (
                  <p>Prezzo Scontato: {discountedPrice}€</p>
                ) : null}

                <p>Totale: {(discountedPrice * item.quantity).toFixed(2)}€</p>
              </div>
            );
          })}
        </div>
        <div className="order-total">
          <p>Subtotale: {subtotal.toFixed(2)}€</p>
          <p>Spedizione: {shippingCost.toFixed(2)}€</p>
          <p>
            <strong>Totale: {(subtotal + shippingCost).toFixed(2)}€</strong>
          </p>
        </div>
        <button
          className="show-form-button"
          onClick={() => setFormVisible(true)} // Mostra il form
        >
          Procedi al Checkout
        </button>
      </div>

      {/* Form */}
      {formVisible && (
        <div className="checkout-form-container">
          <h1 className="checkout-header">Completa Ordine </h1>
          <p>Compila tutti i campi per procedere!</p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="camp-container">
              <input
                type="text"
                name="first_name"
                placeholder="Nome"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={(e) => handleBlur(e, "first_name")}
                required
                pattern="[A-Za-z]{2,}"
                minLength="2"
                title="Il nome deve contenere almeno 2 lettere ."
              />
              {errors.first_name && (
                <p style={{ color: "red" }}>{errors.first_name}</p>
              )}
            </div>

            <div className="camp-container">
              <input
                type="text"
                name="last_name"
                placeholder="Cognome"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={(e) => handleBlur(e, "last_name")}
                required
                minLength="2"
                pattern="[A-Za-z]{2,}"
                title="Il cognome deve contenere almeno 2 caratteri ."
              />
              {errors.last_name && (
                <p style={{ color: "red" }}>{errors.last_name}</p>
              )}
            </div>

            <div className="camp-container">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => handleBlur(e, "email")}
                required
                title="Inserisci un indirizzo email valido."
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>

            <div className="camp-container">
              <input
                type="number"
                name="phone"
                placeholder="Telefono"
                value={formData.phone}
                min={9}
                onChange={handleChange}
                onBlur={(e) => handleBlur(e, "phone")}
                required
                title="Il numero di telefono deve contenere solo cifre."
              />
              {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
            </div>

            <div className="double-camp">
              <input
                className="big-input"
                type="text"
                name="street"
                placeholder="Via"
                value={shipmentDetails.street}
                onChange={handleShipmentChange}
                onBlur={(e) => handleBlur(e, "street")}
                required
              />
              <input
                className="small-input"
                type="number"
                name="house_number"
                placeholder="N'"
                value={shipmentDetails.house_number}
                onChange={handleShipmentChange}
                onBlur={(e) => handleBlur(e, "house_number")}
                required
              />
              {errors.street && <p style={{ color: "red" }}>{errors.street}</p>}
              {errors.house_number && (
                <p style={{ color: "red" }}>{errors.house_number}</p>
              )}
            </div>

            <div className="double-camp">
              <input
                className="big-input"
                type="text"
                name="city"
                placeholder="Città"
                value={shipmentDetails.city}
                onChange={handleShipmentChange}
                onBlur={(e) => handleBlur(e, "city")}
                required
              />

              <input
                className="small-input"
                type="number"
                name="zip_code"
                placeholder="CAP"
                value={shipmentDetails.zip_code}
                onChange={handleShipmentChange}
                required
              />
              {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
            </div>

            <div className="camp-container">
              <input
                type="text"
                name="province"
                placeholder="Provincia"
                value={shipmentDetails.province}
                onChange={handleShipmentChange}
                onBlur={(e) => handleBlur(e, "province")}
                required
              />
              {errors.province && (
                <p style={{ color: "red" }}>{errors.province}</p>
              )}
            </div>

            <div className="checkbox">
              <input
                type="checkbox"
                id="sameAddress"
                checked={useSameAddress}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="sameAddress">
                Usa lo stesso indirizzo per la fatturazione
              </label>
            </div>
            {!useSameAddress && (
              <>
                <h3>Inserisci l' indirizzo di fatturazione</h3>
                <div className="double-camp">
                  <input
                    className="big-input"
                    type="text"
                    name="street"
                    placeholder="Via"
                    value={billingDetails.street}
                    onChange={handleBillingChange}
                    required
                  />
                  <input
                    className="small-input"
                    type="text"
                    name="house_number"
                    placeholder="N'"
                    value={billingDetails.house_number}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
                <div className="double-camp">
                  <input
                    className="big-input"
                    type="text"
                    name="city"
                    placeholder="Città"
                    value={billingDetails.city}
                    onChange={handleBillingChange}
                    required
                  />

                  <input
                    className="small-input"
                    type="text"
                    name="zip_code"
                    placeholder="CAP"
                    value={billingDetails.zip_code}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="camp-container">
                  <input
                    type="text"
                    name="province"
                    placeholder="Provincia"
                    value={billingDetails.province}
                    onChange={handleBillingChange}
                    onBlur={(e) => handleBlur(e, "province")}
                    required
                  />
                  {errors.province && (
                    <p style={{ color: "red" }}>{errors.province}</p>
                  )}
                </div>
              </>
            )}
            <button type="submit" disabled={loading}>
              {loading ? "Elaborazione in corso..." : "Conferma Ordine"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
