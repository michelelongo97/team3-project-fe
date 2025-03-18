import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Ottieni l'ID dell'utente
  useEffect(() => {
    axios
      .get("/wishlist/get-user-id")
      .then((res) => setUserId(res.data.user_id))
      .catch((error) =>
        console.error("Errore nel recupero dell'user_id:", error)
      );
  }, []);

  // Sincronizza la wishlist con il server
  const syncWishlist = () => {
    if (!userId) return;

    axios
      .get(`/wishlist/${userId}`)
      .then((res) => {
        setWishlist(res.data);
        localStorage.setItem("wishlist", JSON.stringify(res.data)); // Sincronizza con localStorage
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          // Se la wishlist non esiste, impostiamo semplicemente un array vuoto
          setWishlist([]);
          localStorage.setItem("wishlist", JSON.stringify([]));
        } else {
          setError(error.message);
        }
      });
    // .catch((error) => setError(error.message));
  };

  // Carica la wishlist all'avvio
  useEffect(() => {
    syncWishlist();
  }, [userId]);

  // Funzione per aggiungere/rimuovere libri dalla wishlist
  const toggleWishlist = async (bookId) => {
    if (!userId) {
      console.error("User ID non trovato.");
      return;
    }

    setWishlist((prevWishlist) => {
      const isInWishlist = prevWishlist.some((book) => book.id === bookId);
      let updatedWishlist;

      if (isInWishlist) {
        updatedWishlist = prevWishlist.filter((book) => book.id !== bookId);
      } else {
        updatedWishlist = [...prevWishlist, bookId];
      }

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });

    try {
      if (wishlist.some((book) => book.id === bookId)) {
        await axios.delete("/wishlist", {
          data: { user_id: userId, book_id: bookId },
        });
      } else {
        await axios.post("/wishlist", { user_id: userId, book_id: bookId });
      }
      syncWishlist(); // Aggiorna la wishlist dopo la modifica
    } catch (error) {
      console.error("Errore nella gestione della wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, error, toggleWishlist, syncWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlistContext() {
  return useContext(WishlistContext);
}

export { WishlistProvider, useWishlistContext };
