export default function Cart() {
  return (
    <div className="cart-container">
      <h1 className="cart-title">Il tuo carrello</h1>

      <div className="cart-content">
        <div className="empty-cart">
          <p>Il tuo carrello è vuoto</p>
          <button className="continue-shopping-btn">
            Continua lo shopping
          </button>
        </div>

        <div className="cart-items">
          <div className="cart-item">
            <div className="item-details">
              <div className="item-info">
                <img src="./img/rosa.jpg" alt="Libro" className="item-image" />

                <h3 className="item-title">Titolo del Libro</h3>
                <p className="item-price">€9.99</p>
              </div>
            </div>
            <div className="item-actions">
              <button className="quantity-btn">-</button>
              <span className="quantity">1</span>
              <button className="quantity-btn">+</button>
              <button className="remove-btn">Rimuovi</button>
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <span>Totale:</span>
            <span className="total-amount">€9.99</span>
          </div>
          <button className="checkout-btn">Procedi all'acquisto</button>
        </div>
      </div>
    </div>
  );
}
