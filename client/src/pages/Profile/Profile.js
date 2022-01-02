import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import Loading from "../../components/Loading/Loading";
import "./Profile.css";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(UserContext);

  const fetchPosts = async () => {
    await fetch("/mypost", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => setPosts(result?.myPosts?.reverse()));
  };

  // async callbacks can't be passed to useEffect
  useEffect(() => fetchPosts(), []);

  return (
    <>
      {loading ? (
        <div className="profile">
          <div className="profileContainer">
            <div className="profileImage">
              <img src="/sirsourav.jpg" alt="Person Image" />
            </div>
            <div className="profileDescription">
              <h4>{state?.name}</h4>
              <div className="">
                <h6>{posts.length} Posts</h6>
                <h6>40 Followers</h6>
                <h6>40 Following</h6>
              </div>
            </div>
          </div>
          <div className="gallery">
            {posts?.map((post) => (
              <div className="itemContainer" key={post._id}>
                <img className="item" src={post.photo} alt="" />
              </div>
            ))}
          </div>
          {!posts?.length && (
            <h2 className="noPostsText">NO POSTS TO DISPLAY!</h2>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Profile;
