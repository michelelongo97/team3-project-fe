import { Link } from "react-router-dom";

export default function BookCard({ title, image, author, price }) {
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };
  return (
    <div className="book-relate-container">
      <div className="book-relate-card">
        <Link to={`/books/${generateSlug(title)}`} className="book-relate-link">
          <img src={image} alt={title} className="book-relate-image" />
          <h3 className="book-relate-title">{title}</h3>
          <p className="book-relate-author">{author}</p>
          <p className="book-relate-price">{price}€</p>
        </Link>
      </div>
    </div>
  );
}
