import React from "react";
import Footer from "./footer";

import LoginForm from "./loginForm";

const landingPage = () => {
  return (
    <>
      <div className="bg-landing-bg h-screen bg-cover bg-center">
        <div className="navbar flex w-[85%] justify-between ">
          <div className="branding flex items-center">
            <img className="w-28" src="/SS_logo-removebg-preview.png" alt="" />
            <p className="text-white text-4xl font-bold italic font-georgiapro">
              SwasthSetu
            </p>
          </div>
          <div className="flex w-6 gap-2">
            <img className="invert" src="/icons8-facebook.svg" alt="" />
            <img className="invert" src="/icons8-linkedin.svg" alt="" />
            <img className="invert" src="/icons8-twitter.svg" alt="" />
            <img className="invert" src="/icons8-youtube.svg" alt="" />
            <img className="invert" src="/icons8-instagram.svg" alt="" />
          </div>
        </div>

        <div className="middleBox w-[70%] h-[67%] mt-6 rounded-[45px] bg-white/30 mx-auto flex">
          <div className="allText">
            <div className="text1 leading-tight pl-14 pt-7 text-[300%] font-bold text-[#212a37] ">
              <p>Your</p>
              <p>Trusted</p>
              <p>Platform</p>
            </div>
            <div className="text2 pl-14 pt-8">
              <p>Welcome to the Hospital pannel of SwasthSetu</p>
              <p>Easily manage doctors, appointments and patient queues </p>
              <p>Your secure gateway to smarter, connected healthcare</p>
            </div>
          </div>
          <div className="loginForm mt-2 ml-7">
               <LoginForm/>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default landingPage;
