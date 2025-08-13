import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Footer from './footer';
import Lottie from "lottie-react";
import AnimationData from "../assets/landing_a2.json"; // path to your json file

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="min-h-screen bg-landing-bg bg-cover bg-no-repeat h-full flex flex-col overflow-hidden">
      {/* Main Heading Section */}
      <div className="mainLine leading-tight">
        <div className="font-georgiapro font-bold italic pl-[170px] pt-7 w-full">
          <div className="text-2xl pl-[150px] animate-tracking-in-expand">
            Where clarity meets care~
          </div>
          <div className="pl-52 flex items-center text-6xl">
            <img className="w-28" src="SS_logo-removebg-preview.png" alt="SwasthSetu Logo" />
            <p className="text-blue-950">SwasthSetu</p>
          </div>
          <div className="text-2xl pl-[450px] animate-tracking-in-expand">
            connects you to what matters
          </div>
        </div>

        {/* Middle Content Section */}
        <div className="middleContent bg-gray-300/80 w-[70%] mx-auto mt-6 h-72 rounded-[13px] p-10">
          <div>
            <p className="text-3xl font-georgiapro font-bold text-[#0097b2]">Your Digital</p>
            <p className="text-3xl font-georgiapro font-bold text-[#0097b2]">Healthcare Platform</p>
          </div>

          <div className="combo flex justify-between items-center ">
            {/* Text Description */}
            <div className="font-georgiapro text-[#737373] max-w-[60%] mt-7">
              <p>SwasthSetu transforms healthcare into a simple, smooth experience </p>
              <p>  with AI at its core, from consultation to records, booking </p>
              <p>to recovery, manage your health effortlessly — all in one place</p>
            </div>

            {/* Lottie Animation */}
            <div className="flex justify-center items-center absolute right-24 p-0 m-0">
              <Lottie
                animationData={AnimationData}
                loop={true}
                style={{ width: 400, height: 400 }}
              />
            </div>
          </div>
              {/* Button Section */}
     <main>
  {!isAuthenticated && (
    <button className="blob-btn mt-7" onClick={() => loginWithRedirect()}>
      Click here to Start today
      <span className="blob-btn__inner">
        <span className="blob-btn__blobs">
          <span className="blob-btn__blob"></span>
          <span className="blob-btn__blob"></span>
          <span className="blob-btn__blob"></span>
          <span className="blob-btn__blob"></span>
        </span>
      </span>
    </button>
  )}

  {/* Gooey filter */}
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: "none" }}>
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 21 -7"
          result="goo"
        ></feColorMatrix>
        <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
      </filter>
    </defs>
  </svg>
</main>

        </div>

    
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
