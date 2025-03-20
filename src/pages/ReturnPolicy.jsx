import { Link } from "react-router";

export default function ReturnPolicy() {
  return (
    <div>
      <div className="return-policy-container">
        <h1 className="return-title">Politica di Reso</h1>
        <p className="return-text">
          Se non sei soddisfatto del tuo acquisto, puoi restituire il prodotto
          seguendo questi passaggi:
        </p>
        <ul className="return-list">
          <li>
            Assicurati che il prodotto sia in condizioni originali e non
            danneggiato.
          </li>
          <li>
            Contatta il nostro supporto via email a{" "}
            <strong>resi@libroecommerce.com</strong> entro 14 giorni
            dall'acquisto.
          </li>
          <li>Riceverai le istruzioni per la spedizione del reso.</li>
          <li>
            Una volta ricevuto il reso, elaboreremo il rimborso entro 7 giorni
            lavorativi.
          </li>
        </ul>
        <p className="return-note">
          Nota: I costi di spedizione per il reso sono a carico del cliente,
          salvo errori da parte nostra.
        </p>
      </div>
      <div className="btn-footer">
        <Link to="/">
          <button className="return-home-btn-footer">←</button>{" "}
        </Link>
      </div>
    </div>
  );
}
