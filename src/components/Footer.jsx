export default function Footer() {
  return (
    <footer className="bookstore-footer container">
      <div className="footer-container">
        <div className="footer-section">
          <h3>La Nostra Libreria</h3>
          <p>
            Dal 2010 portiamo il piacere della lettura direttamente a casa tua,
            con una selezione curata di libri per ogni gusto e interesse.
          </p>
          <p className="btn-link">La nostra storia</p>
        </div>

        <div className="footer-section">
          <h3>Scopri</h3>
          <ul>
            <li>
              <p>Novità del mese</p>
            </li>
            <li>
              <p>Bestseller</p>
            </li>
            <li>
              <p>Autori del momento</p>
            </li>
            <li>
              <p>Offerte speciali</p>
            </li>
            <li>
              <p>Consigliati per te</p>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Servizi Clienti</h3>
          <ul>
            <li>
              <p>Assistenza clienti</p>
            </li>
            <li>
              <p>Politica di reso</p>
            </li>
            <li>
              <p>Domande frequenti</p>
            </li>
            <li>
              <p>Lascia un feedback</p>
            </li>
            <li>
              <p>Garanzia soddisfatti</p>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contatti</h3>
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
          <h3>Seguici</h3>
          <div className="social-links">
            <p aria-label="Facebook">
              <i className="fa fa-facebook"></i>
            </p>
            <p aria-label="Instagram">
              <i className="fa fa-instagram"></i>
            </p>
            <p aria-label="Twitter">
              <i className="fa fa-twitter"></i>
            </p>
            <p aria-label="Pinterest">
              <i className="fa fa-pinterest"></i>
            </p>
            <p aria-label="Goodreads">
              <i className="fa fa-goodreads"></i>
            </p>
          </div>
          <div className="newsletter">
            <h4>Ricevi novità e offerte</h4>
            <p className="small">
              Iscriviti per ricevere consigli di lettura e promozioni esclusive!
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
            &copy; {new Date().getFullYear()} La Tua Libreria Srl. Tutti i
            diritti riservati.
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
