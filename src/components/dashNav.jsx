import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    <div className="w-[95%] mx-auto bg-transparent">
      <nav className="items-center justify-between bg-transparent">
        <img className="w-20" src="/SS_logo-removebg-preview.png" alt="Logo" />
        
        <ul className="flex gap-7 mr-7 font-bold items-center">
          <li className="text-[#1D104E]">
            <NavLink
              to="/dashboard/upcoming_appointments"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
              upcoming appointments
            </NavLink>
          </li>

          <li className="text-[#1D104E]">
            <NavLink
              to="/dashboard/completed_appointments"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
              Completed appointments
            </NavLink>
          </li>

          <li className="text-[#1D104E]">
            <NavLink
              to="/dashboard/cancelled"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
             Cancelled appointments
            </NavLink>
          </li>

          <li className="text-[#1D104E]">
            <NavLink
              to="/dashboard/reports"
              className={({ isActive }) =>
                isActive
                  ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl"
                  : "navlink"
              }
            >
             reports
            </NavLink>
          </li>

        
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
