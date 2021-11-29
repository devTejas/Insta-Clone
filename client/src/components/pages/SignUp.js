import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { signUp } from "../../services/UserAuthentication";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUpUser = async () => {
    try {
      const { token, error } = await signUp(name, email, password);
      if (error) throw error;

      M.toast({ html: "User created & Signed In successfully!" });
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
            Name
            <input
              className="input-field"
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="label-field">
            Email
            <input
              className="input-field"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="label-field">
            Password
            <input
              className="input-field"
              type="password"
              placeholder="Enter your password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={signUpUser}
        >
          SignUp
        </button>
        <Link className="linkText" to="/signin">
          Already have an account?
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
