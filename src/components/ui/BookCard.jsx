import { Link } from "react-router-dom";

export default function BookCard({ id, title, image, author, price }) {
  return (
    <div className="book-card">
      <Link to={`/books/${id}`}>
        <img src={image} alt={title} />
        <h3>{title}</h3>
        <p>{author}</p>
        <p>{price}€</p>
      </Link>
    </div>
  );
}