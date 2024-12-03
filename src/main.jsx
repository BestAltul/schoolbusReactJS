import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Импортируем BrowserRouter
import "./index.css";
import App from "./App.jsx";
import SchoolBus from "./components/SchoolBusFront/SchoolBus.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SchoolBus />
    </BrowserRouter>
  </StrictMode>
);
