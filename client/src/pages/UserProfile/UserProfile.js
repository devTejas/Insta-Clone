import M from "materialize-css";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Loading from "../../components/Loading/Loading";
import debouncedCb from "../../services/useDebounce";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followState, setFollowState] = useState("follow");
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  // fetch user profile & posts
  const fetchData = async () => {
    // await fetch(
    //   `/user/${userid}`
    //   // ,{headers: {"Content-Type": "application/json",
    //   //     Authorization: `Bearer ${localStorage.getItem("jwt")}`}}
    // )
    //   .then((res) => res.json())
    //   .then((result) => setPosts(result?.myPosts?.reverse()));
    await fetch(`/user/${userid}`)
      .then((res) => res.json())
      .then((result) => {
        setPosts(result?.posts?.reverse());
        setUser(result?.user);
        setLoading(false);
      });
  };

  const deletePost = (postId) => {
    try {
      fetch(`/deletepost/${postId}`, {
        method: "delete",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      })
        .then((res) => res.json())
        .then(({ message }) => {
          setPosts(posts.filter((post) => post._id !== postId));
          M.toast({ html: message, classes: "green" });
        });
    } catch (err) {
      console.log(err);
      M.toast({ html: err, classes: "red" });
    }
  };

  const debouncedDeletePost = debouncedCb(deletePost, 500);

  // check if currentUser already follows the user(profile currently seeing)
  const isFollower = () => {
    let val =
      user?.followers?.findIndex((id) => id === state?._id) >= 0 ? true : false;
    // console.log(user, val, userid, state?._id);
    // if val=true ie. current_user follows this user, so show `unfollow`
    val ? setFollowState("unfollow") : setFollowState("follow");
  };

  // async callbacks can't be passed to useEffect
  useEffect(() => fetchData(), [userid]);

  useEffect(isFollower, [user, state]);

  const followUser = () => {
    try {
      fetch(`/${followState}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ followId: userid }),
      })
        .then((res) => res.json())
        .then((user) => {
          // there is no need for a dispatch as well, because this data is directly fetched
          // dispatch({
          //   type: "UPDATE",
          //   payload: {
          //     following: user?.following,
          //     followers: user?.followers,
          //   },
          // });

          // here the user is profile of user currently viewing, hence if setItem is done, it replaces the logged in user data. setItem can be done if the user returned is the logged in user
          // setItemLS("user", user);

          if (user?.error) throw user?.error;
          setUser(user);

          // only following needs to be updated - followers of the logged in user aren't important
          dispatch({ type: "UPDATE", payload: { userid, followState } });

          followState === "follow"
            ? setFollowState("unfollow")
            : setFollowState("follow");
        });
    } catch (error) {
      M.toast({ html: error, classes: "red" });
    }
  };

  const debouncedFollowUser = debouncedCb(followUser, 500);

  return (
    <>
      {!loading ? (
        <div className="profile">
          <div className="profileContainer">
            <div className="profileImage">
              <img src={user?.imgURL} alt="Person Image" />
            </div>
            <div className="profileDescription">
              <h4>{user?.name}</h4>
              <div className="">
                <h6>{posts.length} Posts</h6>
                <h6>{user?.followers?.length} Followers</h6>
                <h6>{user?.following?.length} Following</h6>
              </div>
              {userid !== state?._id && (
                <button
                  style={{ cursor: `${state ? "" : "not-allowed"}` }}
                  className="btn waves-effect 64b5f6 blue darken"
                  onClick={state && debouncedFollowUser}
                >
                  {followState}
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {posts?.map((post) => (
              <div className="itemContainer" key={post._id}>
                {state?._id === userid && (
                  <i
                    className="material-icons deleteBtn"
                    onClick={() => debouncedDeletePost(post._id)}
                  >
                    delete
                  </i>
                )}
                <img className="item" src={post.photo} alt="" />
              </div>
            ))}
          </div>
          {!posts.length && (
            <h2 className="noPostsText">NO POSTS TO DISPLAY!</h2>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UserProfile;
