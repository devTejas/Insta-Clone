import M from "materialize-css";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", images);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "pleasecontrol");
    const url = await fetch(
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
        throw err;
      });

    // console.log(url);
    return url;
  };

  const uploadPost = async () => {
    try {
      if (!title || !body || !images)
        throw { error: "Please add all the Fields" };

      const photo = await uploadImage(); // photo -> imageURL
      // console.log(photo);
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          title,
          body,
          photo,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.error)
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          else {
            M.toast({ html: "Success", classes: "green" });
            navigate("/");
          }
        });
    } catch ({ error }) {
      console.log(error);
      M.toast({ html: error, classes: "#c62828 red darken-3" });
    }
  };

  // render image before uploading
  const renderImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => setImageURL(e.target.result);
    setImages(file);
  };

  return (
    <div className="container">
      <div className="card input-field uploadFileCard">
        <div className="" style={{ textAlign: "left" }}>
          <label className="inputLabel">
            Title
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="inputLabel">
            Body
            <textarea
              type="text"
              placeholder="Body"
              defaultValue={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </label>
        </div>
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
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={uploadPost}
        >
          Submit Post
        </button>
      </div>
      <img src={imageURL} alt="" className="uploadedImage" />
    </div>
  );
};

export default CreatePost;
