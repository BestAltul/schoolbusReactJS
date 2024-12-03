import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function HeaderComponent() {
  return (
    <div className="HeaderComponent">
      <header className="border-bottom border-light border-5 mb-5 p-2">
        <div className="container">
          <div className="row">
            <nav className="navbar navbar-expand-lg">
              <a
                className="navbar-brand ms-2 fs-2 fw-bold text-black"
                href="https://www.schoolbus.com"
              >
                School bus
              </a>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                  <li className="nav-item fs-5">
                    <Link className="nav-link" to="/welcome">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item fs-5">
                    <Link className="nav-link" to="/bus_list">
                      Todos
                    </Link>
                  </li>
                </ul>
              </div>
              <ul className="navbar-nav">
                <li className="nav-item fs-5">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item fs-5">
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
