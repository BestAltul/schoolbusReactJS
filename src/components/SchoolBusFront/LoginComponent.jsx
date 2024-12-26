import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./security/AuthContext";

export default function LoginComponent() {
  const [username, setUserName] = useState("admin");
  const [password, setPassword] = useState("");

  const [showErrorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();
  const authContext = useAuth();
  function handleUsernameChange(event) {
    setUserName(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleSubmit() {
    if (authContext.login(username, password)) {
      navigate(`/welcome/${username}`);
    } else {
      setErrorMessage(true);
    }
  }
  return (
    <div className="Login">
      <h1>Login page</h1>
      {showErrorMessage && (
        <div className="errorMessage">Authenticated failed</div>
      )}

      <div className="LoginForm">
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div>
          <button type="button" name="login" onClick={handleSubmit}>
            login
          </button>
        </div>
      </div>
    </div>
  );
}
