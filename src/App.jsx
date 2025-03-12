// --------IMPORT--------//
import { BrowserRouter, Routes, Route } from "react-router";
import DefaultLayout from "./layouts/DefualtLayouts";
// --------PAGES--------//
import Homepage from "./pages/Homepage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
        <Route index path="/" element={<Homepage/>}/> 
        <Route index path="/cart" element={<Cart/>}/> 
        <Route index path="/wishlist" element={<Wishlist/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
