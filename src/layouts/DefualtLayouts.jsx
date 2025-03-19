import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DefaultLayout({ cartItems }) {
  return (
    <>
      <Header cartItems={cartItems} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
