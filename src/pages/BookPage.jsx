import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CardSinglePage from "../components/ui/CardSinglePage";
import BookCard from "../components/ui/BookCard";
import { useAlertContext } from "../context/AlertContext";
import { Link } from "react-router-dom";

export default function BookPage({ addToCart }) {
  const [book, setBook] = useState({});
  const [relatedBooks, setRelatedBooks] = useState([]);
  const { slug } = useParams();
  const { setAlert } = useAlertContext();

  useEffect(() => {
    axios
      .get(`/books/slug/${slug}`)
      .then((res) => {
        console.log("Risposta API libro:", res.data);
        const bookData = res.data;
        setBook(bookData);
        console.log("Dettagli libro:", res.data);

        return axios.get(`/books/related-books/${bookData.id}`);
      })
      .then((res) => {
        setRelatedBooks(res.data);
        console.log("Libri correlati:", res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          console.log("Libro non trovato");
        }
      });
  }, [slug]);
  //funzione per chiamare addToCart con l'Alert
  const handleAddToCart = (book) => {
    addToCart(book); // Chiamata alla funzione passata da App

    setAlert({
      type: "success",
      message: "Articolo aggiunto al carrello",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="new-container">
      <div>
        <Link to="/">
          <button className="return-home-btn">←</button>{" "}
        </Link>
      </div>
      <CardSinglePage {...book} />
      <div className="buy-button-position">
        <button onClick={() => handleAddToCart(book)} className="buy-button">
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="margin-cart">Aggiungi al Carrello</span>
        </button>
      </div>
      <div className="relate-title">
        <h2>Libri correlati</h2>
      </div>
      <div className="related-books">
        {relatedBooks.length > 0 ? (
          relatedBooks.map((book) => (
            <BookCard key={book.id} {...book} addToCart={addToCart} />
          ))
        ) : (
          <p>Nessun libro correlato disponibile.</p>
        )}
      </div>
    </section>
  );
}
