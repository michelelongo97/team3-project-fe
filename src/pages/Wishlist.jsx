import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

export default function Wishlist() {
  //   const [wishlist, setWishlist] = useState([]);
  //   const [books, setBooks] = useState([]);

  //   useEffect(() => {
  //     // Recupera la wishlist salvata nel localStorage
  //     const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  //     setWishlist(savedWishlist);

  //     // Se la wishlist non è vuota, recupera i dettagli dei libri
  //     if (savedWishlist.length > 0) {
  //       axios
  //         .get(`/books?ids=${savedWishlist.join(",")}`) // API per ottenere i dettagli dei libri
  //         .then((response) => {
  //           setBooks(response.data);
  //         })
  //         .catch((error) =>
  //           console.error("Errore nel recupero della wishlist:", error)
  //         );
  //     }
  //   }, []);

  //   const removeFromWishlist = (bookId) => {
  //     const updatedWishlist = wishlist.filter((id) => id !== bookId);
  //     setWishlist(updatedWishlist);
  //     localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  //     setBooks(books.filter((book) => book.id !== bookId));
  //   };
  return (
    <section>
      <h1>La mia Wishlist</h1>
      {/* {books.length > 0 ? (
        <div className="wishlist-container">
          {books.map((book) => (
            <div key={book.id} className="wishlist-item">
              <Link to={`/books/${book.id}`}>
                <img src={book.image} alt={book.title} />
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <p>{book.price}€</p>
              </Link>
              <button
                onClick={() => removeFromWishlist(book.id)}
                className="remove-btn"
              >
                ❌ Rimuovi
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>La tua wishlist è vuota.</p>
      )} */}
    </section>
  );
}
