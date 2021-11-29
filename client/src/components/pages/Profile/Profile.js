import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  console.log(posts);

  useEffect(async () => {
    await fetch("/mypost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => setPosts(result.myPosts));
  }, []);

  return (
    <div className="profile">
      <div className="profileContainer">
        <div className="profileImage">
          <img src="/sirsourav.jpg" alt="Person Image" />
        </div>
        <div className="profileDescription">
          <h4>Sir Sourav Joshi</h4>
          <div className="">
            <h6>40 Posts</h6>
            <h6>40 Followers</h6>
            <h6>40 Following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {posts.map((post) => (
          <div className="itemContainer" key={post._id}>
            <img className="item" src={post.photo} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
