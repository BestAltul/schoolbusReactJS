import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";
import WelcomeComponent from "./WelcomeComponent";
import ErrorComponent from "./ErrorComponent";
import BusListComponent from "./BusListComponent";
import CameraListComponent from "./DashCameraComponent";
import BusFormComponent from "./BusFormComponent";
import "./SchoolBus.css";
import "./Welcome.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import AuthProvider, { useAuth } from "./security/AuthContext";
import { Navigate } from "react-router-dom";

function AuthenticatedRoute({ children }) {
  const authContext = useAuth();
  if (authContext.isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

export default function SchoolBus() {
  return (
    <div className="SchoolBus">
      <AuthProvider>
        <BrowserRouter>
          <HeaderComponent />
          <Routes>
            <Route path="/" element={<LoginComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/welcome/:username"
              element={
                <AuthenticatedRoute>
                  <WelcomeComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/welcome/"
              element={
                <AuthenticatedRoute>
                  <WelcomeComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/bus_list"
              element={
                <AuthenticatedRoute>
                  <BusListComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/edit/:name"
              element={
                <AuthenticatedRoute>
                  <BusFormComponent isEdit={true} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/new_bus"
              element={
                <AuthenticatedRoute>
                  <BusFormComponent isEdit={false} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/camera_list"
              element={
                <AuthenticatedRoute>
                  <CameraListComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <AuthenticatedRoute>
                  <LogoutComponent />
                </AuthenticatedRoute>
              }
            />

            <Route path="*" element={<ErrorComponent />} />
          </Routes>
          <FooterComponent />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
