import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import BusListPage from "./pages/BuslistPage";
import CameraListPage from "./pages/CameralistPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/buses" />} />
          <Route path="/buses" element={<BusListPage />} />
          <Route path="/cameras" element={<CameraListPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
