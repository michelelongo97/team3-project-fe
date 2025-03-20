// --------IMPORT--------//
import { BrowserRouter, Routes, Route } from "react-router";
import { WishlistProvider } from "./context/WishlistContext";
import { AlertProvider } from "./context/AlertContext";
import DefaultLayout from "./layouts/DefualtLayouts";
// --------PAGES--------//
import Homepage from "./pages/Homepage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import BookPage from "./pages/BookPage";
import Checkout from "./pages/Checkout";
import { useState, useEffect } from "react";
import Help from "./pages/Help";
import ReturnPolicy from "./pages/ReturnPolicy";
import FAQ from "./pages/FAQ";
import OurStory from "./pages/OurStory";
import Team from "./pages/Team";
import Blog from "./pages/Blog";

import axios from "./api/axios";

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  // Funzione per ottenere gli articoli nel carrello all'avvio
  const fetchCart = async () => {
    try {
      const response = await axios.get("/cart");
      setCartItems(response.data.cart); // Imposta gli articoli nel carrello
    } catch (error) {
      console.error("Errore durante il recupero del carrello", error);
    }
  };
  // Esegui il fetch quando il componente viene montato
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = (book) => {
    axios
      .post("/cart", {
        id: book.id,
        quantity: 1,
      })
      .then((res) => {
        setMessage(res.data.message);
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.id === book.id);
          if (existingItem) {
            return prevItems.map((item) =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 } // Incrementa la quantità
                : item
            );
          }
          return [...prevItems, { ...book, quantity: 1 }];
        });
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message ||
            "Errore durante l'aggiunta al carrello."
        );
      });
  };
  return (
    <BrowserRouter>
      <AlertProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<DefaultLayout cartItems={cartItems} />}>
              <Route
                index
                path="/"
                element={<Homepage addToCart={addToCart} />}
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/books/:slug"
                element={<BookPage addToCart={addToCart} />}
              />
              <Route
                index
                path="/cart"
                element={
                  <Cart cartItems={cartItems} setCartItems={setCartItems} />
                }
              />
              <Route index path="/wishlist" element={<Wishlist />} />
              <Route path="/help" element={<Help/>}/>
              <Route path="/return-policy" element={<ReturnPolicy/>}/>
              <Route path="/FAQ" element={<FAQ/>}/>
              <Route path="/about" element={<OurStory/>}/>
              <Route path="/team" element={<Team/>}/>
              <Route path="/blog" element={<Blog/>}/>
            </Route>
          </Routes>
        </WishlistProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}
