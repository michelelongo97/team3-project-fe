import { useWishlistContext } from "../../context/WishlistContext";
import { useEffect } from "react";

export default function CardSinglePage({
  id,
  title,
  image,
  price,
  author,
  category,
  year_of_release,
  discountId,
  discount_type,
  value,
  discountDescription,
  format,
  start_date,
  end_date,
  year_edition,
  isbn,
  pages_number,
  description,
  original_title,
}) {
  // Recupera lo stato della wishlist e le funzioni per aggiornarla dal contesto
  const { wishlist, toggleWishlist, syncWishlist } = useWishlistContext();

  // Sincronizza la wishlist al montaggio del componente
  useEffect(() => {
    syncWishlist();
  }, []);

  return (
    <div className="product-page">
      <div className="product-content">
        {/* Sezione immagine del prodotto */}
        <div className="product-image">
          <img src={image} alt={title} />
        </div>

        {/* Sezione dettagli del prodotto */}
        <div className="product-details">
          <div className="row">
            {/* Titolo del libro e titolo originale (se presente) */}
            <h1 className="product-title">
              {title} {original_title && `- (${original_title})`}
            </h1>

            {/* Pulsante per aggiungere/rimuovere il libro dalla wishlist */}
            <div className="single-wish">
              <button
                className="wishlist-button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(id);
                }}
              >
                {/* Controlla se il libro è nella wishlist per cambiare icona */}
                {wishlist.some((b) => b.id === id) ? (
                  <i className="fa-solid fa-heart"></i> // Cuore pieno se è nella wishlist
                ) : (
                  <i className="fa-regular fa-heart"></i> // Cuore vuoto se non è nella wishlist
                )}
              </button>
            </div>
          </div>

          {/* Sezione autore e prezzo con eventuale sconto */}
          <div className="discount-price-author-container">
            <h2 className="product-author">{author}</h2>

            {/* Se il libro ha uno sconto attivo, calcola il nuovo prezzo */}
            {discountId &&
            new Date() >= new Date(start_date) &&
            new Date() <= new Date(end_date) ? (
              discount_type === "percentage" ? (
                <div className="discount-container">
                  {/* Prezzo originale barrato */}
                  <span className="old-price">{price}€</span>
                  <span>{discountDescription}</span>
                  {/* Nuovo prezzo calcolato con la percentuale di sconto */}
                  <span className="new-price">
                    {(price - (price * value) / 100).toFixed(2)}€
                  </span>
                </div>
              ) : (
                <div className="discount-container">
                  {/* Prezzo originale barrato */}
                  <span className="old-price">{price}€</span>
                  <span>{discountDescription}</span>
                  {/* Prezzo scontato fisso */}
                  <span className="new-price">{value}€</span>
                </div>
              )
            ) : (
              // Se non c'è sconto attivo, mostra solo il prezzo normale
              <p className="price">{price}€</p>
            )}
          </div>

          {/* Sezione con dettagli aggiuntivi sul libro */}
          <div className="box-detail">
            <span className="product-info">
              Genere: <p>{category}</p>
            </span>
            <span className="product-info">
              Anno di pubblicazione: <p>{year_of_release}</p>
            </span>
            <span className="product-info">
              Anno di edizione: <p>{year_edition}</p>
            </span>
            <span className="product-info">
              Formato: <p>{format}</p>
            </span>
            <span className="product-info">
              ISBN: <p>{isbn}</p>
            </span>
            <span className="product-info">
              Numero di pagine: <p>{pages_number}</p>
            </span>
            <span className="product-info">
              Descrizione: <p>{description}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
