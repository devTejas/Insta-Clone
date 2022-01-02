import M from "materialize-css";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { signIn } from "../services/UserAuthentication";

const SignIn = () => {
  const { state, dispatch } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signInUser = async (guestUser = false) => {
    try {
      const { token, user, error } = await signIn(email, password, guestUser);
      if (error) throw error;

      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "USER", payload: user });

      M.toast({ html: "Signed in successfully!", classes: "green" });
      navigate("/");
    } catch (err) {
      M.toast({ html: err, classes: "#c62828 red darken-3" });
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <div className="" style={{ textAlign: "left" }}>
          <label className="label-field">
            Email
            <input
              className="input-field"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="label-field">
            Password
            <input
              className="input-field"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="loginButtonsContainer">
          <button
            onClick={() => signInUser(false)}
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
          >
            Login
          </button>
          <button
            className="guestLoginBtn"
            // className="btn waves-effect waves-light #E76F51 blue darken-1 guestLoginBtn"
            onClick={() => signInUser(true)}
          >
            GUEST LOGIN
          </button>
        </div>
        <Link className="linkText" to="/signup">
          Don't have an account?
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
