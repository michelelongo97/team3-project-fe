import { useAlertContext } from "../context/AlertContext";
import { useEffect } from "react";
export default function Alert() {
  const { alert, setAlert } = useAlertContext();

  const classes = {
    success: "success",
    danger: "danger",
  };

  const AlertClose = () => {
    setAlert({ type: "", message: "" });
  };
  // Timer Alert
  useEffect(() => {
    if (!alert.message) return;
    const timer = setTimeout(() => {
      AlertClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <div className="container-alert">
      <div className={classes[alert.type]}>
        {alert.message}
        <button className="btn-alert" onClick={AlertClose}>
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
      </div>
    </div>
  );
}
