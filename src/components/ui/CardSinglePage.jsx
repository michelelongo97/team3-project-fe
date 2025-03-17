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
  description,
  original_title,
}) {
  return (
    <div className="product-page">
      <div className="product-content">
        <div className="product-image">
          <img src={image} alt={title} />
        </div>
        <div className="product-details">
          <h1 className="product-title">
            {title} {original_title && `- (${original_title})`}
          </h1>
          <div className="discount-price-author-container">
            <h2 className="product-author">{author}</h2>
            {discountId &&
            new Date() >= new Date(start_date) &&
            new Date() <= new Date(end_date) ? (
              discount_type === "percentage" ? (
                <div className="discount-container">
                  <span className="old-price">{price}€</span>
                  <span>{discountDescription}</span>
                  <span className="new-price">
                    {(price - (price * value) / 100).toFixed(2)}€
                  </span>
                </div>
              ) : (
                <div className="discount-container">
                  <span className="old-price">{price}€</span>
                  <span>{discountDescription}</span>
                  <span className="new-price">{value}€</span>
                </div>
              )
            ) : (
              <p className="price">{price}€</p>
            )}
            </div>
          <div className="box-detail">
            <span className="product-info">
              Genere: <p>{category}</p>
            </span>
            <span className="product-info">
              Anno di pubblicazione: <p>{year_of_release}</p>
            </span>
            <span className="product-info">
              Anno di edizione: <p>{year_edition}</p>
            </span>
            <span className="product-info">
              Formato: <p>{format}</p>
            </span>
            <span className="product-info">
              ISBN: <p>{isbn}</p>
            </span>
            <span className="product-info">
              Numero di pagine: <p>{pages_number}</p>
            </span>
            <span className="product-info">
              Descrizione: <p>{description}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
