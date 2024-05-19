import { Button, TextInput, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment.jsx";
function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/v1/comment/new-comment`, {
        content: comment,
        userId: currentUser._id,
        postId: postId,
      });
      if (res.data.success) {
        console.log(res.data.data);
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchInitialComments = async () => {
    try {
      const res = await axios.get(`/api/v1/comment/get-comments/${postId}`);
      if (res.data.success) {
        console.log(res.data.data);
        setAllComments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.patch(`api/v1/comment/like-comment/${commentId}`,{
        userId:currentUser._id
      });
      if (res.data.success) {
        console.log(res.data.data);
        fetchInitialComments();
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchInitialComments();
  }, [postId]);
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>

          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.photourl}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            <p>@{currentUser.username}</p>
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be logged in to post a Comment.
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleAddComment}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
              <Button outline gradientDuoTone="purpleToBlue" type="submit">
                Submit
              </Button>
            </p>
          </div>
        </form>
      )}

      <div>
        {allComments.length === 0 && (
          <p className="text-sm my-5">Be the first to comment!</p>
        )}
        <div>
          <div className="text-sm my-5 flex flex-col gap-1">
            <div>
              <span>Comments </span>
              <span className="border border-gray-400 py-1 px-2 rounded-sm">
                {allComments.length}
              </span>
            </div>
            {allComments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={handleLike}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
