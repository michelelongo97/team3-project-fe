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
  const [sameGenreBooks, setSameGenreBooks] = useState([]);
  const [sameAuthorBooks, setSameAuthorBooks] = useState([]);
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
        console.log("Libri correlati:", res.data);
        setRelatedBooks(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          console.log("Libro non trovato");
        }
      });
  }, [slug]);

  // **Nuovo useEffect per filtrare i libri dopo che book e relatedBooks sono stati caricati**
  useEffect(() => {
    if (book && relatedBooks.length > 0) {
      const sameGenreBooks = relatedBooks.filter((b) => b.genre === book.genre);
      const sameAuthorBooks = relatedBooks.filter(
        (b) => b.author === book.author
      );
      setSameGenreBooks(sameGenreBooks);
      setSameAuthorBooks(sameAuthorBooks);
    }
  }, [book, relatedBooks]);

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
      {/* Sezione per libri dello stesso genere */}
      {sameGenreBooks.length > 0 && (
        <div className="related-category">
          <div className="relate-title">
            <h2>Altri libri {book.category}</h2>
          </div>

          <div className="related-books">
            {sameGenreBooks.map((book) => (
              <BookCard key={book.id} {...book} addToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
      {/* Sezione per libri dello stesso autore */}
      {sameAuthorBooks.length > 0 && (
        <div className="related-category">
          <div className="relate-title">
            <h2>Altri libri di {book.author}</h2>
          </div>
          <div className="related-books">
            {sameAuthorBooks.map((book) => (
              <BookCard key={book.id} {...book} addToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
      {sameGenreBooks.length === 0 &&
        sameAuthorBooks.length === 0 &&
        relatedBooks.length === 0 && <p>Nessun libro correlato disponibile.</p>}
    </section>
  );
}
