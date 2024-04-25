import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../images/logo.jpg';
import '../style/navBar.css';

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <nav className="navbar">
      <Link to="/home">
        <img src={logo} alt="Pet Connect Logo" className="navbar-logo" />
      </Link>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/recommendations">Matching</Link>
        <Link to="/chatlist">Chat</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/auth-debugger">Auth Debugger</Link>
        {isAuthenticated ? (
          <div className="auth-links">
            <Link to="/profile" className="user-name">
              <i className="fa fa-user" aria-hidden="true"></i> {user.name}
            </Link>
            <button onClick={() => logout({ returnTo: window.location.origin })} className="auth-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <button onClick={() => loginWithRedirect()} className="auth-button">
              Login/SignUp
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

