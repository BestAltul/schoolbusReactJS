import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";
import WelcomeComponent from "./WelcomeComponent";
import ErrorComponent from "./ErrorComponent";
import BusListComponent from "./BusListComponent";
import CameraListComponent from "./DashCamListComponent";
import BusFormComponent from "./BusFormComponent";
import DashcamFormComponent from "./DashCamFormComponent";
import RadioListComponent from "./RadioListComponent";
import RadioFormComponent from "./RadioFormComponent";
import SimCardListComponent from "./SimCardListComponent";
import SimCardFormComponent from "./SimCardFormComponent";
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
              path="/new_dashcam"
              element={
                <AuthenticatedRoute>
                  <DashcamFormComponent isEdit={false} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/dashcam-edit/:drid"
              element={
                <AuthenticatedRoute>
                  <DashcamFormComponent isEdit={true} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/radio_list"
              element={
                <AuthenticatedRoute>
                  <RadioListComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/new_radio"
              element={
                <AuthenticatedRoute>
                  <RadioFormComponent isEdit={false} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/radio-edit/:imei"
              element={
                <AuthenticatedRoute>
                  <RadioFormComponent isEdit={true} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/simcard-list"
              element={
                <AuthenticatedRoute>
                  <SimCardListComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/new-simcard"
              element={
                <AuthenticatedRoute>
                  <SimCardFormComponent isEdit={false} />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/simcard-edit/:number"
              element={
                <AuthenticatedRoute>
                  <SimCardFormComponent isEdit={true} />
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
