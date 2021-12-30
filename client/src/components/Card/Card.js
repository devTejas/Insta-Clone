import React from "react";

const Card = ({ title, description, children }) => {
  return (
    <div className="card ">
      <h3 className="">{title}</h3>
      <div className="card-content">
        <p className="">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default Card;
