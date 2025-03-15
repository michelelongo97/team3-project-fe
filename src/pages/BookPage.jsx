import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CardSinglePage from "../components/ui/CardSinglePage";
import BookCard from "../components/ui/BookCard";

export default function BookPage() {
  const [book, setBook] = useState({});
  const [relatedBooks, setRelatedBooks] = useState([]);
  const { id } = useParams();

  useEffect(() => {

    axios.get(`/books/${id}`)
      .then(res => {
        setBook(res.data);
        console.log("Dettagli libro:", res.data);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          console.log("Libro non trovato");
        }
      });

    axios.get(`/related-books/${id}`)
      .then(res => {
        setRelatedBooks(res.data);
        console.log("Libri correlati:", res.data); 
      })
      .catch(err => {
        console.log("Errore nel caricamento dei libri correlati", err);
      });
  }, [id]);

  return (
    <section>
      <CardSinglePage {...book} />
      <h2>Libri correlati</h2>
      <div className="related-books">
        {relatedBooks.length > 0 ? (
          relatedBooks.map(book => <BookCard key={book.id} {...book} />)
        ) : (
          <p>Nessun libro correlato disponibile.</p>
        )}
      </div>
    </section>
  );
}

