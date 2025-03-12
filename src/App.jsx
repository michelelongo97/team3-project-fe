// --------IMPORT--------//
import { BrowserRouter, Routes, Route } from "react-router";
import DefaultLayout from "./layouts/DefualtLayouts";
import Homepage from "./pages/Homepage";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
        <Route index path="/" element={<Homepage/>}/> 
        <Route index path="/cart" element={<Cart/>}/> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
