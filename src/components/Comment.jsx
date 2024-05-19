import React, { useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Modal, Textarea } from "flowbite-react";
function Comment({ comment, onLike }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [openModel, setModelOpen] = useState(false);
  // console.log(comment);
  const [content, setContent] = useState("");
  // console.log(content);
  const handleEdit = () => {
    setIsEditing(true);
    setContent(comment.content);
  };
  const handleEditSubmit = async () => {
    try {
      const res = await axios.patch(
        `api/v1/comment/edit-comment/${comment._id}`,
        {
          content,
        }
      );
      comment.content = res.data.data.content;
      console.log(res.data);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteComment = async () => {
    try {
     const res = await axios.delete(`api/v1/comment/delete-comment/${comment._id}`);
     if(res.data.success){
      setModelOpen(false);

     }
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className="flex border-b dark:border-gray-600 text-sm p-4">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={comment.userId.photourl}
          alt={comment.userId.username}
        ></img>
      </div>
      <div className="flex-1 ">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            @{comment.userId.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-2"
              rows="3"
            ></Textarea>
            <div className="flex gap-2">
              <Button
                onClick={handleEditSubmit}
                gradientDuoTone="purpleToBlue"
                outline
                size="sm"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                color="gray"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-${
                  comment.likes.includes(currentUser._id)
                    ? "blue-500"
                    : "gray-400"
                } hover:text-red-500`}
              >
                <FaThumbsUp className="text-sm" />
              </button>

              <p className="text-gray-400">
                {comment.numberOfLikes}{" "}
                {comment.numberOfLikes === 0 || comment.numberOfLikes === 1
                  ? "like"
                  : "likes"}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                )}

              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={() => setModelOpen(true)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                )}
            </div>
          </>
        )}
      </div>
      <Modal
        popup
        size="md"
        show={openModel}
        onClose={() => setModelOpen(false)}
      >
        <Modal.Header>Are You Sure?</Modal.Header>
        <Modal.Body>
          <p>You want to delete this post</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            color="failure"
            onClick={handleDeleteComment}
          >
            Yes, Delete
          </Button>
          <Button color="gray" onClick={() => setModelOpen(false)}>
            No, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Comment;
