// --------COMPONENTS--------//
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
export default function Header({ cartItems }) {
  return (
    <header>
      <div className="container">
        <div className="row-x">
          <Link to="/">
            <img className="logo" src="/img/book_logo2.png" alt="LOGO" />
          </Link>
          <Navbar cartItems={cartItems} />
        </div>
      </div>
    </header>
  );
}
