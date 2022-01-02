import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="content_loading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100px"
        height="100px"
        viewBox="0 0 100 100"
        className="content_loading_animation"
      >
        <circle cx="30" cy="50">
          <animate
            attributeName="r"
            values="0;5;0"
            dur="1.2s"
            repeatCount="indefinite"
          ></animate>
        </circle>
        <circle cx="50" cy="50">
          <animate
            attributeName="r"
            values="0;5;0"
            dur="1.2s"
            begin="0.4s"
            repeatCount="indefinite"
          ></animate>
        </circle>
        <circle cx="70" cy="50">
          <animate
            attributeName="r"
            values="0;5;0"
            dur="1.2s"
            begin="0.8s"
            repeatCount="indefinite"
          ></animate>
        </circle>
      </svg>
    </div>
  );
};

export default Loading;
