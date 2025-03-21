import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAlertContext } from "../context/AlertContext";



export default function Checkout() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
  const [formVisible, setFormVisible] = useState(false); // Stato per controllare la visibilità del form
  const navigate = useNavigate();
  const { setAlert  } = useAlertContext();
  

  

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    shipment_address: "",
    billing_address: "",
  });
  const [shipmentDetails, setShipmentDetails] = useState({
    street: "",
    house_number: "",
    city: "",
    zip_code: "",
    province: "",
  });

  const [billingDetails, setBillingDetails] = useState({
    street: "",
    house_number: "",
    city: "",
    zip_code: "",
    province: "",
  });

  const [errors, setErrors] = useState({});
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateField = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "first_name":
      case "last_name":
        if (value.trim().length < 2) {
          error = `${
            fieldName === "first_name" ? "Il nome" : "Il cognome"
          } deve avere almeno 2 caratteri.`;
        }
        break;
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Inserisci un'email valida (esempio@email.com).";
        }
        break;
      case "phone":
        if (!/^\d{9,}$/.test(value)) {
          error = "Il numero di telefono deve contenere almeno 9 cifre.";
        }
        break;
      case "street":
        if (value.trim().length < 5) {
          error = "La via deve avere almeno 5 caratteri.";
        }
        break;
      case "house_number":
        if (!/^\d+$/.test(value)) {
          error = "Il numero civico deve essere un valore numerico.";
        }
        break;
      case "city":
        if (value.trim().length < 2) {
          error = "La città deve avere almeno 2 caratteri.";
        }
        break;
      case "province":
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

  // Calcolo del subtotale e del costo di spedizione
  const subtotal = cartItems.reduce((total, item) => {
    let discountedPrice = item.price;

    if (item.discount_type === "percentage" && item.value) {
      discountedPrice = item.price - (item.price * item.value) / 100;
    } else if (item.discount_type === "fixed" && item.value) {
      discountedPrice = Math.max(0, item.value);
    }

    return total + discountedPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal > 50 ? 0 : 4.99; // Calcola la spedizione solo se il totale è inferiore a 50€

  const handleShipmentChange = (e) => {
    const { name, value } = e.target;
    setShipmentDetails({ ...shipmentDetails, [name]: value });
    setFormData((prev) => ({
      ...prev,
      shipment_address: `${shipmentDetails.street}, ${shipmentDetails.house_number}, ${shipmentDetails.city}, ${shipmentDetails.province}, ${shipmentDetails.zip_code}`,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
    setFormData((prev) => ({
      ...prev,
      billing_address: `${billingDetails.street}, ${billingDetails.house_number}, ${billingDetails.city}, ${billingDetails.province}, ${billingDetails.zip_code}`,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Validazione quando l'utente lascia il campo
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    console.log("Checkbox selezionata:", isChecked);

    const fullShipmentAddress = `${shipmentDetails.street}, ${shipmentDetails.house_number}, ${shipmentDetails.city}, ${shipmentDetails.province}, ${shipmentDetails.zip_code}`;
    console.log("Shipment Address:", fullShipmentAddress);

    setUseSameAddress(isChecked);

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        billing_address: fullShipmentAddress,
      }));
      setBillingDetails({ ...shipmentDetails });
    } else {
      setFormData((prev) => ({
        ...prev,
        billing_address: "",
      }));
      setBillingDetails({
        street: "",
        house_number: "",
        city: "",
        zip_code: "",
        province: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione di tutti i campi al submit
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

   // if (Object.keys(newErrors).length === 0) {
      //alert("Dati inviati con successo!");
    //}

    setLoading(true);
    try {
      const response = await axios.post("/sales", {
        ...formData,
        total_price: subtotal + shippingCost,
        shipment_cost: shippingCost,
      });

      setAlert({
        type: "success",
        message: "Ordine completato con successo!",
      })

      // Svuota il carrello e il form
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

      setFormVisible(false); // Nasconde il form dopo il completamento

      navigate("/");
    } catch (error) {
      console.error(
        "Errore durante il checkout:",
        error.response?.data?.message || error.message
      );
      setAlert({
        type: "danger",
        message: "Completa tutti campi correttamente!!",
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
                onChange={handleChange}
                onBlur={(e) => handleBlur(e, "phone")}
                min={9}
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
