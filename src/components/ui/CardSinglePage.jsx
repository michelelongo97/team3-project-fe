export default function CardSinglePage({
  title,
  image,
  price,
  author,
  category,
  year_of_release,
  discountId,
  discount_type,
  value,
  discountDescription,
  format,
  start_date,
  end_date,
  year_edition,
  isbn,
  pages_number,
  description
}) {
  return (
    <div className="product-page">
      <div className="product-content">
        <div className="product-image">
          <img src={image} alt={title} />
        </div>

        <div className="product-details">
          <h1 className="product-title">{title}</h1>
          <h2 className="product-author">{author}</h2>

          <p className="product-info">
            Genere: <span>{category}</span>
          </p>
          <p className="product-info">
            Anno di pubblicazione: <span>{year_of_release}</span>
          </p>
          <p className="product-info">
            Anno di edizione: <span>{year_edition}</span>
          </p>
          <p className="product-info">
            Formato: <span>{format}</span>
          </p>
          <p className="product-info">
            ISBN: <span>{isbn}</span>
          </p>
          <p className="product-info">
            Numero di pagine: <span>{pages_number}</span>
          </p>

          <p className="product-description">Descrizione: <span>{description}</span></p>

          {discountId &&
          new Date() >= new Date(start_date) &&
          new Date() <= new Date(end_date) ? (
            discount_type === "percentage" ? (
              <div className="discount-container">
                <span>{discountDescription}</span>
                <span className="old-price">{price}€</span>
                <span className="new-price">
                  {(price - (price * value) / 100).toFixed(2)}€
                </span>
              </div>
            ) : (
              <div className="discount-container">
                <span>{discountDescription}</span>
                <span className="old-price">{price}€</span>
                <span className="new-price">{value}€</span>
              </div>
            )
          ) : (
            <p className="price">{price}€</p>
          )}

          <button className="buy-button">🛒 Acquista Ora</button>
        </div>
      </div>
    </div>
  );
}
