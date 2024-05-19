import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Table, Modal, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showmore, setShowMore] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToBeDeleted, setuserToBeDeleted] = useState(null);
  const ftechusers = async () => {
    try {
      const res = await axios.get(`/api/v1/user/get-users`);
    //   console.log(res);
      if (res.data.success) {
        setUsers(res.data.data.allUsers);
        if (res.data.data.allUsers.length < 9) {
          setShowMore(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowMore = async () => {
    const startIdx = users.length;
    try {
      const res = await axios.get(
        `/api/v1/user/get-users?startIndex=${startIdx}`
      );
      if (res.data.success) {
        if (res.data.data.allUsers.length < 9) {
          setShowMore(false);
        }
        setUsers([...users, ...res.data.data.allUsers]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteuser = async (userid) => {
    // console.log(userid);
    setOpenDeleteModal(false);

    try {
      const res = await axios.delete(
        `/api/v1/user/delete/${userToBeDeleted}`
      );

      if (res.data.success) {
        console.log(res);
        setUsers(users.filter((user) => user._id !== res.data.data._id));
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      ftechusers();
    }
  }, [currentUser._id]);
  //   console.log(users.length);
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <div>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      alt={user.username}
                      src={user.photourl}
                      className=" rounded-full w-10 h-10 object-cover bg-gray-500"
                    ></img>
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setuserToBeDeleted(user._id);
                      }}
                    >
                      Delete
                    </span>
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
        <p> You Have No users yet</p>
      )}
      <Modal
        popup
        size="md"
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Modal.Header>Are You Sure?</Modal.Header>
        <Modal.Body>
          <p>You want to delete this user</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            color="failure"
            onClick={() => handleDeleteuser(userToBeDeleted)}
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

export default DashUsers;
