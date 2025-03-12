export default function CardSinglePage({
  title,
  image,
  price,
  author,
  category,
  year_of_release,
  discount_percentage,
  discounted_price,
  format,
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
        {discount_percentage ? (
          <div>
            <span className="old-price">{price}€</span>
            <div>
              <span>-{discount_percentage}%</span>
              <span>{discounted_price}€</span>
            </div>
          </div>
        ) : (
          <p>{price}€</p>
        )}
      </div>
    </div>
  );
}
