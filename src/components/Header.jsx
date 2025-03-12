// --------COMPONENTS--------//
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header>
      <div className="container">
        <img className="logo" src="./img/bookstore.jpg" alt="" />
        <h1>BOOKSTORE</h1>
        <Navbar />
      </div>
    </header>
  );
}
