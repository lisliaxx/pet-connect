import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../style/landing.css'; 

function LandingPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to PetConnect</h1>
        <p>Log in or sign up to enter the loved world!</p>
        <button onClick={() => loginWithRedirect()} className="landing-button">Log In / Sign Up</button>
      </div>
    </div>
  );
}

export default LandingPage;

