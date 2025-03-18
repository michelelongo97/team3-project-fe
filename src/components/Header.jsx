// --------COMPONENTS--------//
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header>
        <Link to="/">
          <img className="logo" src="/img/book_logo2.png" alt="LOGO" />
        </Link>
        <Navbar />
    </header>
  );
}
