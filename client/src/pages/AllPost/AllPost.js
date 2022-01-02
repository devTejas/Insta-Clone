import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import Post from "../../components/Post/Post";
import "./AllPost.css";

const AllPost = () => {
  const [data, setData] = useState(null);

  const fetchPosts = () => {
    fetch("/allpost", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    })
      .then((res) => res.json())
      .then((result) => setData(result.posts.reverse()));
  };

  useEffect(fetchPosts, []);

  return (
    <div className="home">
      {data ? (
        <>
          {data?.map((item) => (
            <Post key={item._id} {...item} />
          ))}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default AllPost;
