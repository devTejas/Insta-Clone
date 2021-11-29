import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(data, result.posts);
        setData(result.posts);
        console.log(data);
      });
  }, []);

  return (
    <div className="home">
      {data.map((item) => (
        <div className="card home-card" key={item._id}>
          <h5>{item.postedBy.name}</h5>
          <div className="card-image">
            <img src={item.photo} />
          </div>
          <div className="card-content">
            <i className="material-icons likeIcon">favorite</i>
            <h6>{item.title}</h6>
            <p>{item.body}</p>
            <input type="text" placeholder="add a comment" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
