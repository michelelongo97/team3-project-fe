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

export default function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <WishlistProvider>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route index path="/" element={<Homepage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/books/:slug" element={<BookPage />} />
              <Route index path="/cart" element={<Cart />} />
              <Route index path="/wishlist" element={<Wishlist />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}
