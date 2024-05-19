import { TextInput, Select, Button, FileInput, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../firebase.js";
import { getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
function CreatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    title: "",
    category: "",
    image: "",
  });
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const handleUploadImage = async (req, res) => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      setImageUploadProgress(null);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
          //   console.log(imageUploadProgress);
          // console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              setImageUploadError(
                "User doesn't have permission to access the object"
              );
              setImageUploadProgress(null);
              break;
            case "storage/canceled":
              setImageUploadError("Upload canceled");
              setImageUploadProgress(null);
              // User canceled the upload
              break;

            case "storage/unknown":
              setImageUploadError("Unknown error occurred");
              setImageUploadProgress(null);
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            return setData({ ...data, image: downloadURL });
          });
        }
      );
    } catch (err) {
      console.log(err);
      setImageUploadError(err.message);
      setImageUploadProgress(null);
    }
  };
  const handleCreatePostSubmit = async () => {
    try {
      const res = await axios.post("/api/v1/post/create", data);
      console.log(res);
      if (res.data.success) {
        setFile(null);
        setData({
          title: "",
          category: "",
          image: "",
        });
        navigate(`/post/${res.data.data.slug}`);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
          <Select
            onChange={(e) => setData({ ...data, category: e.target.value })}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nodejs">Node.js</option>
          </Select>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            name="image"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {imageUploadProgress === null && (
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
            >
              Upload Image
            </Button>
          )}
          {imageUploadProgress && (
            <Button
              disabled
              type="button"
              isProcessing
              gradientDuoTone="purpleToBlue"
            >
              Loading....
            </Button>
          )}
        </div>
        {data.image && (
          <img
            src={data.image}
            alt="uploaded image"
            width="250"
            className="m-auto"
          ></img>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(val) => setData({ ...data, content: val })}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          onClick={handleCreatePostSubmit}
        >
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
