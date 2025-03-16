import { Link } from "react-router-dom";

export default function BookCard({ title, image, author, price }) {
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };
  return (
    <div className="book-card">
      <Link to={`/books/${generateSlug(title)}`}>
        <img src={image} alt={title} />
        <h3>{title}</h3>
        <p>{author}</p>
        <p>{price}€</p>
      </Link>
    </div>
  );
}
