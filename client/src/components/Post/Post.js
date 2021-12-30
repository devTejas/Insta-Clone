import M from "materialize-css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { getItemLS, setItemLS } from "../../services/useLocalStorage";
import "./Post.css";

// _id -> postId
const Post = ({
  _id,
  postedBy: { _id: postUserID, name },
  photo,
  title,
  body,
  likes,
  comments,
  postLikedByUser = false,
}) => {
  const [postLiked, setPostLiked] = useState(postLikedByUser); // whether currentUser liked the post or not
  // For showing number of likes on the post
  const [postLikesArrLength, setPostLikesArrLength] = useState(likes.length);
  const [commentsData, setCommentsData] = useState(comments.reverse());

  const navigate = useNavigate();

  const {
    state: { _id: UserID },
  } = useContext(UserContext);

  // using debounce for like
  const likePost = () => {
    try {
      fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ postId: _id, postLiked }),
      })
        .then((res) => res.json())
        .then((result) => checkCurrentUserLikedPost(result?.likes));
    } catch (error) {
      console.log(error);
      M.toast({ html: error, classes: "red" });
    }
  };

  const debounceLikePost = (callback, delay) => {
    let timer;
    return function () {
      let context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(context, args), delay);
    };
  };

  const doDebounce = debounceLikePost(likePost, 2000);

  const checkCurrentUserLikedPost = (likesArr = likes) => {
    let indexOfId = likesArr.findIndex((id) => id === UserID);
    setPostLiked(indexOfId >= 0);
    setPostLikesArrLength(likesArr.length);
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ postId, text }),
    })
      .then((res) => res.json())
      .then((result) => setCommentsData(result.comments))
      .catch((err) => console.log(err));
  };

  const deletePost = () => {
    try {
      fetch(`/deletepost/${_id}`, {
        method: "delete",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      })
        .then((res) => res.json())
        .then(({ message }) => {
          const viewPostObj = getItemLS("viewPost");
          var x = viewPostObj[_id] ? setItemLS("viewPost", { _id: null }) : "";
          M.toast({ html: message, classes: "" });
        });
    } catch (err) {
      console.log(err);
      M.toast({ html: err, classes: "" });
    }
  };

  // to check if the user has previously liked the post or not
  useEffect(checkCurrentUserLikedPost, []);

  // if comment/view_post is clicked, then savePostDetails function is called & it saves the post details in localStorage & the ViewPost page fetches the data from the localStorage using postId
  // const savePostDetails = () => {
  //   const postData = {
  //     _id,
  //     postedBy: { _id: postUserID, name },
  //     photo,
  //     title,
  //     body,
  //     likes,
  //     comments,
  //     postLiked,
  //     postLikesArrLength,
  //   };

  //   const viewPostObj = getItemLS("viewPost") ?? {};
  //   viewPostObj[_id] = postData;
  //   setItemLS("viewPost", viewPostObj);

  //   navigate(`/post/${_id}`);
  // };

  return (
    <div className="card home-card" key={_id}>
      <h5>
        {name}
        {UserID === postUserID && (
          <i
            className="material-icons"
            style={{ float: "right", cursor: "pointer" }}
            onClick={deletePost}
          >
            delete
          </i>
        )}
      </h5>
      {/* <Link to={`/post/${_id}`}> */}
      <div className="card-image postImage">
        <img src={photo} />
      </div>
      {/* </Link> */}
      <div className="card-content">
        <h6 className="postTitle">{title}</h6>
        <p className="postBody"> {body}</p>
        <div className="post_bottom">
          {/* Comment post */}
          <div className="">
            <svg viewBox="0 0 26 26" aria-hidden="true" className="post-icon">
              <g>
                <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
              </g>
            </svg>
            <span>{commentsData.length}</span>
          </div>
          {/* like Post */}
          <div onClick={doDebounce}>
            <svg
              viewBox="0 0 26 26"
              aria-hidden="true"
              className={postLiked ? "iconLiked like-icon" : "like-icon"}
            >
              <g>
                <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
              </g>
            </svg>
            <span>{postLikesArrLength}</span>
          </div>
          {/* share post */}
          <div>
            <svg viewBox="0 0 26 26" aria-hidden="true" className="post-icon">
              <g>
                <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
                <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
              </g>
            </svg>
            <span></span>
          </div>
        </div>
        <div className="commentsSection">
          <p className="">Comments</p>
          {commentsData.map(({ _id, text, postedBy: { name } }) => (
            <div key={_id} className="commentItem">
              <h6>{name}</h6>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <form
          className="sendComment"
          onSubmit={(e) => {
            e.preventDefault();
            makeComment(e.target[0].value, _id);
            e.target[0].value = "";
          }}
        >
          <input type="text" placeholder="add a comment" />
        </form>
      </div>
    </div>
  );
};

export default Post;
