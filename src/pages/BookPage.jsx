import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CardSinglePage from "../components/ui/CardSinglePage";
import BookCard from "../components/ui/BookCard";
import { useAlertContext } from "../context/AlertContext";
import { Link } from "react-router-dom";

export default function BookPage({ addToCart }) {
  // Stato per memorizzare i dettagli del libro
  const [book, setBook] = useState({});
  // Stato per i libri correlati
  const [relatedBooks, setRelatedBooks] = useState([]);
  // Stato per i libri dello stesso genere
  const [sameGenreBooks, setSameGenreBooks] = useState([]);
  // Stato per i libri dello stesso autore
  const [sameAuthorBooks, setSameAuthorBooks] = useState([]);

  // Otteniamo il parametro "slug" dall'URL
  const { slug } = useParams();
  // Otteniamo la funzione setAlert dal contesto per mostrare notifiche
  const { setAlert } = useAlertContext();

  // Effettua una richiesta API per ottenere i dettagli del libro e i libri correlati
  useEffect(() => {
    axios
      .get(`/books/slug/${slug}`) // Chiamata API per ottenere i dettagli del libro
      .then((res) => {
        console.log("Risposta API libro:", res.data);
        const bookData = res.data;
        setBook(bookData); // Salviamo i dettagli del libro nello stato
        console.log("Dettagli libro:", res.data);

        // Ora facciamo un'altra chiamata API per ottenere i libri correlati
        return axios.get(`/books/related-books/${bookData.id}`);
      })
      .then((res) => {
        console.log("Libri correlati:", res.data);
        setRelatedBooks(res.data); // Salviamo i libri correlati nello stato
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          console.log("Libro non trovato");
        }
      });
  }, [slug]); // Si attiva ogni volta che cambia lo slug (quando l'utente naviga tra diversi libri)

  // Aggiorna i libri dello stesso genere e dello stesso autore una volta che abbiamo i libri correlati
  useEffect(() => {
    if (book && relatedBooks.length > 0) {
      // Filtra i libri dello stesso genere
      const sameGenreBooks = relatedBooks.filter((b) => b.genre === book.genre);
      // Filtra i libri dello stesso autore
      const sameAuthorBooks = relatedBooks.filter((b) => b.author === book.author);

      setSameGenreBooks(sameGenreBooks); // Aggiorna lo stato con i libri dello stesso genere
      setSameAuthorBooks(sameAuthorBooks); // Aggiorna lo stato con i libri dello stesso autore
    }
  }, [book, relatedBooks]); // Si attiva ogni volta che cambia il libro o i libri correlati

  // Funzione per aggiungere il libro al carrello
  const handleAddToCart = (book) => {
    addToCart(book); // Chiama la funzione passata come prop per aggiungere il libro al carrello

    // Mostra un avviso di successo
    setAlert({
      type: "success",
      message: "Articolo aggiunto al carrello",
    });
  };

  // Effetto per scorrere automaticamente all'inizio della pagina quando il componente viene montato
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
