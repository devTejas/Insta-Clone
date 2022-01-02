import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import Loading from "../../components/Loading/Loading";
import Post from "../../components/Post/Post";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(() => true);
  const [{ userFollowingPosts, userNotFollowingPosts }, setPosts] = useState({
    userFollowingPosts: null,
    userNotFollowingPosts: null,
  });

  const { state } = useContext(UserContext);

  // if user is logged in, show only posts he is following else show all the posts
  // const fetchPosts = () => {
  //   if (state) {
  //     const fetchPostsArr = [];

  //     fetch("/post", {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
  //     })
  //       .then((res) => res.json())
  //       .then((result) => setData(result.posts.reverse()));
  //   }
  // };

  // useEffect(fetchPosts, [state]);

  const fetchPosts = () => {
    fetch("/allpost")
      .then((res) => res.json())
      .then(({ posts }) => {
        if (state) {
          let userFollowingPosts = [];
          let userNotFollowingPosts = [];
          posts.reverse().forEach((post) => {
            // console.log(post, state, state?.following, post?.postedBy?._id);
            if (
              state?.following.findIndex((id) => post?.postedBy?._id === id) >
              -1
            )
              userFollowingPosts.push(post);
            else userNotFollowingPosts.push(post);
          });
          setPosts({ userFollowingPosts, userNotFollowingPosts });
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (state) fetchPosts();
  }, [state]);

  return (
    <div className="home">
      {!loading ? (
        <>
          <div className="">
            <p style={{ textAlign: "center" }} className="">
              {!userFollowingPosts.length && userFollowingPosts.length} Posts
              from people you are following!
            </p>
            {userFollowingPosts?.map((item) => (
              <Post key={item._id} {...item} />
            ))}
          </div>
          <div style={{ borderTop: "1px solid gray" }} className="">
            <p style={{ textAlign: "center" }} className="">
              Posts from people you are not following!
            </p>
            {userNotFollowingPosts?.map((item) => (
              <Post key={item._id} {...item} />
            ))}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Home;
