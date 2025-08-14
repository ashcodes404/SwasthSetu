import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "./footer";
import Lottie from "lottie-react";
import AnimationData from "../assets/landing_a2.json"; // path to your json file
import Heartbeat from "../assets/heartbeat.json" // heartbeat file 

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="overflow-hidden ">
    <div className="min-h-screen bg-landing-bg bg-cover bg-no-repeat h-full flex flex-col ">
      {/* Main Heading Section */}
      <div className="mainLine leading-tight"></div>

      {/* Middle Content Section */}
      <div className="middleContent bg-white/80 w-[70%]  mx-auto mt-12 h-[95%] rounded-[13px] pb-7 ">
        <div className="font-georgiapro font-bold  pt-1 w-full">
       
           
               <div>
              <div className=" flex items-center justify-between text-6xl">
                <div className="flex items-center">
                <img
                  className="w-20"
                  src="SS_logo-removebg-preview.png"
                  alt="SwasthSetu Logo"
                />
                <p className="text-[#8c52ff] text-[39px] italic ">SwasthSetu</p>
                </div>
                <div className="">
                  <ul className="flex space-x-4 pr-4 absolute top-16 right-48">
                    <li className="w-6"><img src="icons8-facebook.svg" alt="" /></li>
                    <li className="w-6"><img src="icons8-instagram.svg" alt="" /></li>
                    <li className="w-6"><img src="icons8-youtube.svg" alt="" /></li>
                    <li className="w-6"><img src="icons8-linkedin.svg" alt="" /></li>
                    <li className="w-6"><img src="icons8-twitter.svg" alt="" /></li>
                  </ul>
                </div>
               
              </div>
             
        
            <div className="pt-16 pl-5">
              <p className="text-3xl font-georgiapro font-bold text-[#0097b2]">
                Your Digital
              </p>
              <p className="text-3xl font-georgiapro font-bold text-[#0097b2]">
                Healthcare Platform
              </p>
            </div>
          </div>

          <div className="combo flex justify-between items-center ">
            {/* Text Description */}
            <div className="font-georgiapro text-[#737373] max-w-[60%] mt-7 pl-5">
              <p>
                SwasthSetu transforms healthcare into a simple, smooth
                
              </p>
              <p>
               
               experience with AI at its core, from consultation to records,
              </p>
              <p>
                 booking to recovery, manage your health effortlessly — all in one place
              </p>
            </div>

            {/* Lottie Animation */}
              <div className="animated_svg flex flex-col">
      <div className="flex flex-col justify-center items-center absolute top-20 right-24 p-0 m-0 max-w-full overflow-hidden">
        <Lottie
          animationData={AnimationData}
          loop={true}
          style={{ width: 450, height: 450, maxWidth: "100%" }}
        />
        <div className="absolute top-60 right-[87px]">
          <Lottie
            animationData={Heartbeat}
            loop={true}
            style={{ width: 300, height: 300, maxWidth: "100%" }}
          />
        </div>
      </div>
    </div>
          </div>
          {/* Button Section */}
          <main>
            {!isAuthenticated && (
              <button
                className="blob-btn mt-10 ml-5 p-4 rounded-2xl text-xl  "
                onClick={() => loginWithRedirect()}
              >
                Consult Today
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              style={{ display: "none" }}
            >
              <defs>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    result="blur"
                    stdDeviation="10"
                  ></feGaussianBlur>
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
    </div>
  );
};

export default Login;
