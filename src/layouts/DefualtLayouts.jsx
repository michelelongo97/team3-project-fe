import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DefaultLayout({ cartItems }) {
  return (
    <>

      <div className="free-shipping-banner">
        📦 Spedizione gratuita per ordini superiori a 50€! 🛒
      </div>

      <Header cartItems={cartItems} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
