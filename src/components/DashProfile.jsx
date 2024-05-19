import { TextInput, Button, Alert } from "flowbite-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import app from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  logoutSuccess,
} from "../features/user/userSlice";
import "react-circular-progressbar/dist/styles.css";
import { Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imagefileURL, setImageFileURL] = useState(null);
  const filePickerRef = useRef();
  const [imagefileUploadprogress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileuploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleInputImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    const storage = getStorage(app);
    const filenName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filenName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileuploadError("Could not upload image");
        setImageFileUploadProgress(null);
        setImageFileURL(null);
        setImageFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, photourl: downloadURL });
        });
      }
    );
  };
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    try {
      dispatch(updateStart());
      const res = await axios.put(
        `/api/v1/user/update/${currentUser?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        dispatch(updateSuccess(res.data.data));
      }
    } catch (err) {
      if (err.response) {
        dispatch(updateFailure(err.response.data.message));
      }
    }
  };

  const handleDeleteUser = async () => {
    setOpenDeleteModal(false);
    try {
      dispatch(deleteUserStart());
      // console.log(`user deleted ${currentUser?._id}`)
      const res = await axios.delete(`/api/v1/user/delete/${currentUser?._id}`);
      if (res.data.success) {
        dispatch(deleteUserSuccess());
        navigate("/sign-in");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        dispatch(deleteUserFailure(err.response.data.message));
      }
    }
  };

  const handlelogOut = async () => {
    try {
      const res = await axios.get("/api/v1/auth/sign-out");
      if (res.data.success) {
        dispatch(logoutSuccess());
        navigate("/sign-in");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleInputImage}
          ref={filePickerRef}
        />
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <div
          className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imagefileUploadprogress && (
            <CircularProgressbar
              value={imagefileUploadprogress || 0}
              text={`${imagefileUploadprogress}%`}
              strokeWidth={5}
              style={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba (62,152,199,${imagefileUploadprogress / 100})`,
                },
              }}
            ></CircularProgressbar>
          )}
          <img
            src={imagefileURL || currentUser?.photourl}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]  ${
              imagefileUploadprogress &&
              imagefileUploadprogress < 100 &&
              "opacity-60"
            }
            `}
          />
        </div>
        <TextInput
          type="text"
          id="username"
          defaultValue={currentUser?.username}
          onChange={handleInput}
        />
        <TextInput
          type="email"
          id="email"
          defaultValue={currentUser?.email}
          onChange={handleInput}
        />
        <TextInput
          type="password"
          id="password"
          defaultValue={currentUser?.password}
          onChange={handleInput}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleFormSubmit}
        >
          Update
        </Button>
        {currentUser?.isAdmin && (
          <Button gradientDuoTone="purpleToPink" as={Link} to="/create-post">
            Create a Post
          </Button>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-6">
        <span
          className="cursor-pointer"
          onClick={() => {
            setOpenDeleteModal(true);
          }}
        >
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handlelogOut}>
          Sign Out
        </span>
      </div>
      <Modal
        popup
        size="md"
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Modal.Header>Are You Sure you Want to Delete?</Modal.Header>

        <Modal.Footer>
          <Button color="failure" onClick={handleDeleteUser}>
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

export default DashProfile;
