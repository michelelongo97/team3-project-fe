import { createContext, useState, useContext } from "react";
import Alert from "../components/Alert";

// Creazione del contesto per gestire gli alert
const AlertContext = createContext();

// Provider per gestire lo stato globale degli alert
function AlertProvider({ children }) {
  // Stato per gestire il tipo e il messaggio dell'alert
  const [alert, setAlert] = useState({
    type: "",      // Tipo dell'alert (es. success, error)
    message: "",   // Messaggio dell'alert
  });

  return (
    // Il contesto viene reso disponibile a tutti i componenti figli
    <AlertContext.Provider value={{ alert, setAlert }}>
      <Alert />
      {/* I componenti figli che usano questo provider */}
      {children}
    </AlertContext.Provider>
  );
}

// Hook personalizzato per accedere al contesto dell'alert
function useAlertContext() {
  const context = useContext(AlertContext);
  return context; // Ritorna l'oggetto che contiene lo stato e la funzione setAlert
}

// Esportiamo il provider e il custom hook per usarli nei componenti
export { AlertProvider, useAlertContext };
