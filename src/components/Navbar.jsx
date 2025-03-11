import { Link } from "react-router";

export default function Navbar(){
    return(
        <nav>
            <Link to="/" className="navbar">Homepage
            </Link>

            <Link to="/cart" className="navbar">Carrello
            </Link>
        </nav>
    )
}