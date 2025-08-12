import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    <div className="w-[95%] mx-auto">
      <nav className="flex items-center justify-between">
        <img className="w-20 " src="/SS_logo-removebg-preview.png" alt="Logo" />
        
        <ul className="flex gap-7 mr-7 font-bold items-center">
          <li className="text-[#1D104E]">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
              Home
            </NavLink>
          </li>

          <li className="text-[#1D104E]">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
              Contact Us
            </NavLink>
          </li>

          <li className="text-[#1D104E]">
            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
              About Us
            </NavLink>
          </li>

          <li className="text-[#1D104E]">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
              Dashboard
            </NavLink>
          </li>

          {isAuthenticated && (
            <li className="text-[#1D104E]">
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-500 text-white px-3 py-1 rounded-xl"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
