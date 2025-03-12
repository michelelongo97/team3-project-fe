import { Link } from "react-router";

export default function Navbar(){
    return(
        <nav>
            <Link to="/" className="navbar">Homepage
            </Link>

            <Link to="/cart" className="navbar"><i class="fa-solid fa-cart-shopping"></i>
            </Link>

            <Link to="/wishlist" className="navbar"><i class="fa-solid fa-heart"></i>
            </Link>
        </nav>
    )
}