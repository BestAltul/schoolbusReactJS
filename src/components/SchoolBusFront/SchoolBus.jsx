import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";
import WelcomeComponent from "./WelcomeComponent";
import ErrorComponent from "./ErrorComponent";
import BusListComponent from "./BusListComponent";
import "./SchoolBus.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

export default function SchoolBus() {
  return (
    <div className="SchoolBus">
      <HeaderComponent />
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/welcome/:username" element={<WelcomeComponent />} />
        <Route path="/bus_list" element={<BusListComponent />} />
        <Route path="/logout" element={<LogoutComponent />} />
        <Route path="*" element={<ErrorComponent />} />
      </Routes>
      {/* </BrowserRouter> */}
      <FooterComponent />
    </div>
  );
}
