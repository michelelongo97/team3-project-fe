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
}) {
  return (
    <div>
      <div>
        <img src={image} alt={title} />
      </div>
      <div>
        <h1>{title}</h1>
        <h2>{author}</h2>
        <p>Genere: {category}</p>
        <p>Anno: {year_of_release}</p>
        <p>{format}</p>

        {discountId &&
        new Date() >= new Date(start_date) &&
        new Date() <= new Date(end_date) ? (
          discount_type === "percentage" ? (
            //sconto percentuale
            <div>
              <span className="old-price">{price}€</span>
              <div>
                <span>{discountDescription}</span>
                <span>{(price - (price * value) / 100).toFixed(2)}€</span>
              </div>
            </div>
          ) : (
            //sconto fisso
            <div>
              <span className="old-price">{price}€</span>
              <div>
                <span>{discountDescription}</span>
                <span>{value}€</span>
              </div>
            </div>
          )
        ) : (
          //prodotto non scontato
          <p>{price}€</p>
        )}
      </div>
    </div>
  );
}
