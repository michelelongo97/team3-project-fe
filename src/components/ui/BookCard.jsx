import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWishlistContext } from "../../context/WishlistContext";
import { useAlertContext } from "../../context/AlertContext";
import axios from "../../api/axios";

export default function BookCard({
  title,
  image,
  author,
  price,
  id,
  addToCart,
}) {
  // Recupera lo stato della wishlist e le funzioni per aggiornarla dal contesto
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();
  const { setAlert } = useAlertContext();

  // Stato per gestire eventuali messaggi di feedback (attualmente non usato)
  const [message, setMessage] = useState("");

  // Sincronizza la wishlist al montaggio del componente
  useEffect(() => {
    syncWishlist();
  }, []);

  // Fa scorrere la pagina in alto al montaggio del componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Funzione per aggiungere un libro al carrello e mostrare un avviso
  const handleAddToCart = (book) => {
    addToCart(book); // Chiamata alla funzione passata come prop

    setAlert({
      type: "success",
      message: "Articolo aggiunto al carrello",
    });
  };

  // Crea un oggetto libro con le proprietà ricevute
  const book = {
    id,
    title,
    image,
    author,
    price,
  };

  // Funzione per generare uno slug dal titolo del libro (utile per gli URL)
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-") // Sostituisce gli spazi con trattini
      .replace(/[^\w-]+/g, ""); // Rimuove caratteri non alfanumerici
  };

  return (
    <div className="book-relate-card">
      {/* Link alla pagina del libro con uno slug nel percorso */}
      <Link to={`/books/${generateSlug(title)}`} className="book-relate-link">
        {/* Immagine del libro */}
        <img src={image} alt={title} className="book-relate-image" />

        {/* Titolo del libro */}
        <h3 className="book-relate-title book-title">{title}</h3>

        {/* Nome dell'autore */}
        <p className="book-relate-author">{author}</p>

        {/* Prezzo del libro */}
        <p className="book-relate-price">{price}€</p>

        {/* Sezione con i pulsanti di wishlist e carrello */}
        <div className="add-book">
          {/* Pulsante per aggiungere/rimuovere dalla wishlist */}
          <button
            className="wishlist-button"
            onClick={(e) => {
              e.preventDefault(); // Previene la navigazione involontaria
              toggleWishlist(id); // Aggiunge/rimuove il libro dalla wishlist
            }}
          >
            {/* Cambia l'icona in base alla presenza del libro nella wishlist */}
            {wishlist.some((b) => b.id === id) ? (
              <i className="fa-solid fa-heart"></i> // Libro in wishlist
            ) : (
              <i className="fa-regular fa-heart"></i> // Libro non in wishlist
            )}
          </button>

          {/* Pulsante per aggiungere il libro al carrello */}
          <button
            onClick={(e) => {
              e.preventDefault(); // Previene la navigazione
              handleAddToCart(book); // Aggiunge il libro al carrello
            }}
          >
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </Link>
    </div>
  );
}
