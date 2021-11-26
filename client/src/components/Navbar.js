import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right">
            <li>
              <Link to="/signin">SignIn</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/create">Upload</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
