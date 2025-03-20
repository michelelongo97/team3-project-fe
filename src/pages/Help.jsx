import { Link } from "react-router";

export default function Help() {
  return (
    <div>
      <div className="help-container">
        <h1 className="help-title">Assistenza Clienti</h1>
        <p className="help-text">
          Segui questi passaggi per ricevere supporto:
        </p>
        <ul className="help-list">
          <li>
            Scrivi un'email a <strong>support@bookheaven.com</strong> con i
            dettagli del tuo problema.
          </li>
          <li>Attendi una risposta dal nostro team entro 24-48 ore.</li>
          <li>Organizzati in base alle istruzioni ricevute.</li>
          <li>
            Se necessario, parla direttamente con il venditore per risolvere la
            questione.
          </li>
        </ul>
      </div>
      <div className="btn-footer">
        <Link to="/">
          <button className="return-home-btn-footer">←</button>{" "}
        </Link>
      </div>
    </div>
  );
}
