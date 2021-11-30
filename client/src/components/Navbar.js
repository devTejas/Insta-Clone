import M from "materialize-css";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    localStorage.length === 0 && M.toast({ html: "User logged out!" });
    navigate("/signin");
  };

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/signin"} className="brand-logo left">
            Instagram
          </Link>
          <ul id="nav-mobile" className="right">
            {!state && (
              <div>
                <li>
                  <Link to="/signin">SignIn</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </div>
            )}
            {state && (
              <div>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/create">Upload</Link>
                </li>
                <li>
                  <a className="btn #c62828 red darken-3" onClick={logoutUser}>
                    LogOut
                  </a>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
