import React, { useEffect, useState } from "react";
import Post from "../../components/Post/Post";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  console.log(data);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result.posts.reverse()));
  }, []);

  return (
    <div className="home">
      {data.map((item) => (
        <Post key={item._id} {...item} />
      ))}
    </div>
  );
};

export default Home;
