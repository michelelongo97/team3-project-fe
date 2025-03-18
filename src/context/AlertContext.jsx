import { createContext, useState, useContext } from "react";
import Alert from "../components/Alert";

const AlertContext = createContext();

function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });
  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <Alert />
      {children}
    </AlertContext.Provider>
  );
}

function useAlertContext() {
  const context = useContext(AlertContext);
  return context;
}

export { AlertProvider, useAlertContext };
