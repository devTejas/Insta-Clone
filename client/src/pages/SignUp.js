import M from "materialize-css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/UserAuthentication";

const SignUp = () => {
  const [name, setName] = useState(() => "");
  const [email, setEmail] = useState(() => "");
  const [password, setPassword] = useState(() => "");
  const [imageURL, setImageURL] = useState(() => null);
  const [file, setFile] = useState(() => null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "pleasecontrol");
    let url = "";
    url = await fetch(
      "https://api.cloudinary.com/v1_1/pleasecontrol/image/upload",
      {
        method: "post",
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => data.secure_url)
      .catch((err) => {
        console.log(err);
        M.toast({ html: JSON.stringify(err), classes: "red" });
      });

    // console.log(url);
    return url;
  };

  const signUpUser = async () => {
    setLoading(true);
    let imgURL;
    try {
      if (file) imgURL = await uploadImage();
      // console.log(name, email, password, imgURL);
      const { error } = await signUp(name, email, password, imgURL);
      if (error) throw error;
      M.toast({
        html: "User created & Signed In successfully!",
        classes: "green",
      });
      navigate("/");
    } catch (err) {
      setLoading(false);
      M.toast({ html: err, classes: "#c62828 red darken-3" });
    }
  };

  const renderImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => setImageURL(() => e.target.result);
    setFile(() => file);
  };

  return (
    <div
      className="container signUpContainer"
      style={{ height: imageURL && "" }}
    >
      {imageURL && <img src={imageURL} alt="" className="userImage" />}
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
            <div className="file-field input-field">
              <div className="btn #64b5f6 blue darken-1">
                <span>Upload Image</span>
                <input
                  type="file"
                  accept=".png, .jpeg, .jpg, .gif"
                  // multiple={true}
                  onChange={(e) => renderImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input type="text" className="file-path validate" />
              </div>
            </div>
          </div>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={!loading ? signUpUser : () => {}}
          >
            {!loading ? "SignUp" : "..."}
          </button>
          <Link className="linkText" to="/signin">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
