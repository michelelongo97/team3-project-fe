import { Link } from "react-router";
import { useWishlistContext } from "../context/WishlistContext";

export default function Navbar({ cartItems }) {
  const { wishlist } = useWishlistContext();
  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  return (
    <nav className="row-x">
      <Link to="/" className="navbar">
        <h4>HOMEPAGE</h4>
      </Link>

      <Link to="/cart" className="navbar">
        <i className="fa-solid fa-cart-shopping"></i>
        {cartItems.length > 0 && (
          <span className="badge">{calculateTotalQuantity()}</span>
        )}
      </Link>

      <Link to="/wishlist" className="navbar">
        <i className="fa-solid fa-heart"></i>
        {wishlist.length > 0 && (
          <span className="badge">{wishlist.length}</span>
        )}
      </Link>
    </nav>
  );
}
