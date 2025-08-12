import React from "react";
import "../index.css"; // Make sure your loader CSS is in here

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
