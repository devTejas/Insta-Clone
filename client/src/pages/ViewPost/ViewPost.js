import M from "materialize-css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Post from "../../components/Post/Post";
import { getItemLS, setItemLS } from "../../services/useLocalStorage";
import "./ViewPost.css";

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const {
    state: { _id: UserID },
  } = useContext(UserContext);

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
    const { _id } = post;
    try {
      fetch(`/deletepost/${_id}`, {
        method: "delete",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      })
        .then((res) => res.json())
        .then(({ message }) => {
          const viewPostObj = getItemLS("viewPost");
          var x = viewPostObj[_id] ? setItemLS("viewPost", { _id: null }) : "";
          M.toast({ html: message, classes: "green" });
        });
    } catch (err) {
      console.log(err);
      M.toast({ html: err, classes: "red" });
    }
  };

  useEffect(() => {
    fetch(`/post/${id}`)
      .then((res) => res.json())
      .then((result) => setPost(result));
  }, [id]);

  const [commentsData, setCommentsData] = useState(post?.comments?.reverse());

  return (
    <div className="">
      {post ? (
        <>
          {UserID === post?.postedBy?._id && (
            <i
              className="material-icons"
              style={{ float: "right", cursor: "pointer" }}
              onClick={deletePost}
            >
              delete
            </i>
          )}
          <Post key={post._id} {...post} />
          <div className="commentsSection">
            <p className="">Comments</p>
            {commentsData?.map(({ _id, text, postedBy: { name } }) => (
              <div key={_id} className="commentItem">
                <Link to={`/`}>
                  <h6>{name}</h6>
                </Link>
                <h5>{text}</h5>
              </div>
            ))}
          </div>
          <form
            className="sendComment"
            onSubmit={(e) => {
              e.preventDefault();
              makeComment(e.target[0].value, post?._id);
            }}
          >
            <input type="text" placeholder="add a comment" />
          </form>
        </>
      ) : (
        <p className="">Post Not found!</p>
      )}
    </div>
  );
};

export default ViewPost;
