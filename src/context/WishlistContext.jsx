import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

// Creazione del contesto per gestire la wishlist
const WishlistContext = createContext();

// Provider per gestire lo stato globale della wishlist
function WishlistProvider({ children }) {
  // Stato per la wishlist (lista dei libri salvati)
  const [wishlist, setWishlist] = useState([]);
  // Stato per gestire eventuali errori
  const [error, setError] = useState(null);
  // Stato per memorizzare l'ID dell'utente
  const [userId, setUserId] = useState(null);

  // Ottieni l'ID dell'utente (effettua una chiamata al server per ottenere l'ID dell'utente)
  useEffect(() => {
    axios
      .get("/wishlist/get-user-id")
      .then((res) => setUserId(res.data.user_id))
      .catch((error) =>
        console.error("Errore nel recupero dell'user_id:", error)
      );
  }, []); // Eseguito solo una volta quando il componente viene montato

  // Sincronizza la wishlist con il server e memorizza i dati nel localStorage
  const syncWishlist = () => {
    if (!userId) return; // Se l'ID utente non è disponibile, non eseguire la sincronizzazione

    axios
      .get(`/wishlist/${userId}`)
      .then((res) => {
        setWishlist(res.data); // Aggiorna la wishlist con i dati ricevuti
        localStorage.setItem("wishlist", JSON.stringify(res.data)); // Sincronizza con localStorage
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          // Se la wishlist non esiste, impostiamo semplicemente un array vuoto
          setWishlist([]);
          localStorage.setItem("wishlist", JSON.stringify([])); // Salva la wishlist vuota
        } else {
          setError(error.message); // In caso di errore, imposta il messaggio di errore
        }
      });
  };

  // Carica la wishlist all'avvio del componente quando l'userId cambia
  useEffect(() => {
    syncWishlist();
  }, [userId]); // Eseguito ogni volta che l'ID dell'utente cambia

  // Funzione per aggiungere o rimuovere un libro dalla wishlist
  const toggleWishlist = async (bookId) => {
    if (!userId) {
      console.error("User ID non trovato.");
      return; // Se l'ID dell'utente non è disponibile, non fare nulla
    }

    // Modifica la wishlist localmente
    setWishlist((prevWishlist) => {
      const isInWishlist = prevWishlist.some((book) => book.id === bookId);
      let updatedWishlist;

      // Se il libro è già nella wishlist, rimuovilo, altrimenti aggiungilo
      if (isInWishlist) {
        updatedWishlist = prevWishlist.filter((book) => book.id !== bookId);
      } else {
        updatedWishlist = [...prevWishlist, bookId];
      }

      // Salva la wishlist aggiornata nel localStorage
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist; // Restituisci la wishlist aggiornata
    });

    try {
      // Invia la richiesta al server per aggiungere o rimuovere il libro dalla wishlist
      if (wishlist.some((book) => book.id === bookId)) {
        // Rimuovi il libro
        await axios.delete("/wishlist", {
          data: { user_id: userId, book_id: bookId },
        });
      } else {
        // Aggiungi il libro
        await axios.post("/wishlist", { user_id: userId, book_id: bookId });
      }
      syncWishlist(); // Dopo la modifica, sincronizza la wishlist con il server
    } catch (error) {
      console.error("Errore nella gestione della wishlist:", error);
    }
  };

  return (
    // Fornisce la wishlist, error e le funzioni a tutti i componenti figli
    <WishlistContext.Provider
      value={{ wishlist, error, toggleWishlist, syncWishlist }}
    >
      {children} {/* I componenti figli possono accedere a questo contesto */}
    </WishlistContext.Provider>
  );
}

// Hook personalizzato per accedere al contesto della wishlist
function useWishlistContext() {
  return useContext(WishlistContext); // Restituisce il valore del contesto
}

// Esportiamo il provider e il custom hook per poterli usare nei componenti
export { WishlistProvider, useWishlistContext };

