import React from 'react'
import { NavLink } from 'react-router-dom'
const navbar = () => {
  return (
    <div className='w-[80%] mx-auto'>
        <nav className='flex items-center justify-between'>
          <img className='w-24 m-2 '  src="/SS_logo-removebg-preview.png" alt="" />
            <ul className = "flex gap-20 mr-7 font-bold">
                <li className='text-[#1D104E]'> <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl" : "navlink"}
            >
              Home
            </NavLink></li>
                <li className='text-[#1D104E]'> <NavLink 
              to="/contact" 
              className={({ isActive }) => isActive ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl" : "navlink"}
            >
              Contact US
            </NavLink></li>
                <li className='text-[#1D104E]'> <NavLink 
              to="/aboutus" 
              className={({ isActive }) => isActive ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl" : "navlink"}
            >
              About Us
            </NavLink></li>
                <li className='text-[#1D104E]'> <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl" : "navlink"}
            >
              Dashboard
            </NavLink></li>
                <li className='text-[#1D104E] mr-2'> <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? "navlink bg-[#5A63E3] text-white p-2 rounded-xl" : "navlink"}
            >
              Login
            </NavLink></li>
            </ul>
        </nav>
    </div>
  )
}

export default navbar