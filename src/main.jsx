import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SchoolBus from "./components/SchoolBusFront/SchoolBus.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SchoolBus />
  </StrictMode>
);
