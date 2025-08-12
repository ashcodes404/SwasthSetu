import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./login.css";

const login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <div className="min-h-screen bg-landing-bg bg-cover bg-no-repeat">
      <div className="Header">
        <h1>SWASTH SETU</h1>
      </div>
      <div className="Sign_In_Button">
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Sign In</button>
        )}
      </div>
      <div>
        <div className="Logos">
          <div className="Swasth_Setu_Logo">
            <img
              src="SS_logo-removebg-preview.png"
              alt="Logo"
              className="logo"
            />
          </div>
          <div className="Sites_Logo">
            <img src="FacebookUpdated.png" alt="Logo" className="logo" />
            <img src="Instagram.png" alt="Logo" className="logo" />
            <img src="Twitter.png" alt="Logo" className="logo" />
            <img src="Settings.png" alt="Logo" className="logo" />
          </div>
        </div>
        <p className="Introduction">
          Where Clarity Meets Care <br />
          <span className="purple-text">
            Swasth Setu - Connects You To What Matters
          </span>
        </p>
      </div>
    </div>
  );
};

export default login;
