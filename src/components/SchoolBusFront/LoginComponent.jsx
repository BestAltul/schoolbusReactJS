import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const [username, setUserName] = useState("admin");
  const [password, setPassword] = useState("");
  const [showSuccessMessage, setSuccessMessage] = useState(false);
  const [showErrorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();
  function handleUsernameChange(event) {
    setUserName(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleSubmit() {
    if (username === "admin" && password === "password") {
      console.log("Success");
      setSuccessMessage(true);
      setErrorMessage(false);
      navigate(`/welcome/${username}`);
    } else {
      console.log("Failed");
      setErrorMessage(true);
      setSuccessMessage(false);
    }
  }
  return (
    <div className="Login">
      <h1>Login page</h1>
      {showSuccessMessage && (
        <div className="successMessage">Authenticated successfully</div>
      )}
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
