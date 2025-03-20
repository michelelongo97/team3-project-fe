import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bookstore-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📚 La Nostra Libreria</h3>
          <p>
            Dal 2010 portiamo il piacere della lettura direttamente a casa tua,
            con una selezione curata di libri per ogni gusto e interesse.
          </p>
        </div>

        <div className="footer-section">
          <h3>🛠️ Supporto e Assistenza</h3>
          <ul>
            <Link to="help">
              <p>Assistenza clienti</p>
            </Link>
            <Link to="return-policy">
              <p>Politica di reso</p>
            </Link>
            <Link to="FAQ">
              <p>FAQ</p>
            </Link>
          </ul>
        </div>
        <div className="footer-section">
          <h3>ℹ️ Scopri di più su di noi</h3>
          <ul>
            <Link to="/about">
              <p>La nostra storia e mission</p>
            </Link>
            <Link to="/team">
              <p>Il nostro team</p>
            </Link>
            <Link to="/blog">
              <p>Blog e novità</p>
            </Link>
          </ul>
        </div>
        <div className="footer-section">
          <h3>📩 Contatti</h3>
          <address>
            <p>
              Via dei Libri, 42
              <br />
              20123 Milano, Italia
            </p>
            <p>Email: info@tualibreria.it</p>
            <p>Tel: +39 012 3456789</p>
          </address>
        </div>

        <div className="footer-section">
          <div className="newsletter">
            <h4>Ricevi novità e offerte</h4>
            <p className="small">
              Iscriviti per ricevere consigli di lettura e promozioni esclusive!
            </p>
          </div>
          <h3>Seguici</h3>
          <div className="social-links">
            <p aria-label="Facebook">
              <i class="fa-brands fa-square-facebook"></i>
            </p>
            <p aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </p>
            <p aria-label="Twitter">
              <i class="fa-brands fa-twitter"></i>
            </p>
            <p aria-label="Pinterest">
              <i class="fa-brands fa-pinterest-p"></i>
            </p>
            <p aria-label="Goodreads">
              <i class="fa-brands fa-goodreads"></i>
            </p>
          </div>
        </div>
      </div>

      <div className="payment-methods">
        <h4>Metodi di pagamento accettati</h4>
        <div className="payment-icons">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo-700x394.png"
            alt="Visa"
            width="50"
          />
          <img
            src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo-700x394.png"
            alt="Mastercard"
            width="50"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            width="50"
          />
          <img
            src="https://download.logo.wine/logo/Apple_Pay/Apple_Pay-Logo.wine.png"
            alt="Apple Pay"
            width="50"
          />
          <img
            src="https://download.logo.wine/logo/Google_Pay/Google_Pay-Logo.wine.png"
            alt="Google Pay"
            width="50"
          />
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          <p>
            &copy; {new Date().getFullYear()} La BookHeaven Srl. Tutti i diritti
            riservati.
          </p>
        </div>
        <div className="legal-links">
          <p>Privacy Policy</p>
          <p>Termini e Condizioni</p>
          <p>Cookie Policy</p>
          <p>Diritto di recesso</p>
        </div>
      </div>
    </footer>
  );
}
