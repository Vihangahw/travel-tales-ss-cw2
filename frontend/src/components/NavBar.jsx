import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ isLoggedIn, onLogout, onLoginClick, onRegisterClick }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/feed">Feed</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {isLoggedIn ? (
              <button onClick={onLogout} className="btn btn-logout">Logout</button>
            ) : (
              <>
                <button onClick={onLoginClick} className="btn btn-login me-2">Login</button>
                <button onClick={onRegisterClick} className="btn btn-register">Register</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;