// --------COMPONENTS--------//
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <div className="container">
        <Link to="/">
          <img className="logo" src="./img/bookstore.jpg" alt="" />
        </Link>
        <h1>BOOKHEAVEN</h1>
        <Navbar />
      </div>
    </header>
  );
}
