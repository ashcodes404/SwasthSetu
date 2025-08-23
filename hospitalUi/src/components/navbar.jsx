import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      {/* Logo + Title */}
      <div className="title flex items-center ">
        <img className="w-16" src="/SS_logo-removebg-preview.png" alt="Logo" />
        <p className="text-3xl font-bold italic font-georgiapro text-[#8c52ff]">
          SwasthSetu
        </p>
      </div>

      {/* Navigation Links */}
      <ul className="text-xl space-y-5 m-8 mt-20">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-xl ${
                isActive ? "bg-[#5A63E3] text-white" : ""
              }`
            }
          >
            <img className="w-6 mr-2" src="/icons8-dashboard-24.png" alt="" />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-xl ${
                isActive ? "bg-[#5A63E3] text-white" : ""
              }`
            }
          >
            <img className="w-6 mr-2" src="/icons8-booking-32.png" alt="" />
            Appointments
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-xl ${
                isActive ? "bg-[#5A63E3] text-white" : ""
              }`
            }
          >
            <img className="w-6 mr-2" src="/icons8-settings.svg" alt="" />
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
