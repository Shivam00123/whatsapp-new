import React from "react";

const Loader = () => {
  return (
    <div className="container">
      <h1>Generating Image</h1>
      <div className="loading-wrapper">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
