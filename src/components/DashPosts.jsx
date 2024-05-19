import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showmore, setShowMore] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [postToBeDeleted, setPostToBeDeleted] = useState(null);
  const ftechPosts = async () => {
    try {
      const res = await axios.get(
        `/api/v1/post/get-posts?author=${currentUser._id}`
      );
      if (res.data.success) {
        // console.log(res.data.data.posts);
        setPosts(res.data.data.posts);
        if (res.data.data.posts.length < 9) {
          setShowMore(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowMore = async () => {
    const startIdx = posts.length;
    try {
      const res = await axios.get(
        `/api/v1/post/get-posts?author=${currentUser._id}&startIndex=${startIdx}`
      );
      if (res.data.success) {
        if (res.data.data.posts.length < 9) {
          setShowMore(false);
        }
        setPosts([...posts, ...res.data.data.posts]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeletePost = async (postid) => {
    // console.log(postid);
    setOpenDeleteModal(false);

    try {
      const res = await axios.delete(
        `/api/v1/post/delete-post/${postid}/${currentUser._id}`
      );

      if(res.data.success){
        // console.log(res);
        setPosts(posts.filter(post => post._id !== res.data.data._id));
      }
    } catch (err) {
        if(err.response){
            console.log(err.response.data.message);
        }
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      ftechPosts();
    }
  }, [currentUser._id]);
  //   console.log(posts.length);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && posts.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>

              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        alt={post.title}
                        src={post.image}
                        className="w-20 h-10 object-cover bg-gray-500"
                      ></img>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setPostToBeDeleted(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500 hover:underline"
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showmore && (
            <div className="text-center p-5">
              <button
                onClick={handleShowMore}
                className="text-teal-500 hover:underline w-full"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      ) : (
        <p> You Have No posts yet</p>
      )}
      <Modal
        popup
        size="md"
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Modal.Header>Are You Sure?</Modal.Header>
        <Modal.Body>
          <p>You want to delete this post</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            color="failure"
            onClick={() => handleDeletePost(postToBeDeleted)}
          >
            Yes, Delete
          </Button>
          <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
            No, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DashPosts;
