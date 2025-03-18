import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CardSinglePage from "../components/ui/CardSinglePage";
import BookCard from "../components/ui/BookCard";

export default function BookPage() {
  const [book, setBook] = useState({});
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [message, setMessage] = useState("");
  const { slug } = useParams();
  console.log("Slug ricevuto nel frontend:", slug);
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

  const addToCart = () => {
    axios
      .post("/cart", {
        id: book.id,
        quantity: 1,
      })
      .then((res) => {
        setMessage(res.data.message); // Messaggio di successo
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
            "Errore durante l'aggiunta al carrello."
        );
      });
  };

  return (
    <section>
      <CardSinglePage {...book} />
      <div>
        <button onClick={addToCart} className="buy-button">
          {" "}
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="margin-cart">Aggiungi al Carrello</span>
        </button>
        {message && <p>{message}</p>}
      </div>
      <div className="relate-title">
        <h2>Libri correlati</h2>
      </div>
      <div className="related-books">
        {relatedBooks.length > 0 ? (
          relatedBooks.map((book) => <BookCard key={book.id} {...book} />)
        ) : (
          <p>Nessun libro correlato disponibile.</p>
        )}
      </div>
    </section>
  );
}
