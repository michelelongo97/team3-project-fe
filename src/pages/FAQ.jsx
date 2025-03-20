import { useState } from "react";
import { Link } from "react-router";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Quali metodi di pagamento accettate?",
      answer: "Accettiamo carte di credito, PayPal e bonifico bancario.",
    },
    {
      question: "Quanto tempo impiega la spedizione?",
      answer:
        "I tempi di spedizione variano tra 3-5 giorni lavorativi per l'Italia e 7-10 giorni per l'estero.",
    },
    {
      question: "Come posso tracciare il mio ordine?",
      answer:
        "Riceverai un'email con il link per tracciare il tuo ordine dopo la spedizione.",
    },
    {
      question: "Posso modificare o annullare un ordine?",
      answer:
        "Puoi modificare o annullare un ordine entro 12 ore dall'acquisto contattando il supporto.",
    },
  ];

  return (
    <div>
      <div className="faq-container">
        <h1 className="faq-title">Domande Frequenti</h1>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div className="faq-answer-wrapper">
                <p className="faq-answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="btn-footer">
        <Link to="/">
          <button className="return-home-btn-footer">←</button>{" "}
        </Link>
      </div>
    </div>
  );
}
