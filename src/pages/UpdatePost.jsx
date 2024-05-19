import { TextInput, Select, Button, FileInput, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../firebase.js";
import { getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    title: "",
    category: "",
    image: "",
  });
  console.log(data);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const getInitialData = async () => {
    try {
      const res = await axios.get(`/api/v1/post/get-posts?postId=${postId}`);
      if (res.data.success) {
        setData(res.data.data.posts[0]);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };
  useEffect(() => {
    getInitialData();
  }, [postId]);
  const handleUploadImage = async (req, res) => {
    try {
      if (!file) {
        toast.error("Please select an image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      setImageUploadProgress(null);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
          switch (snapshot.state) {
            case "paused":
              toast.warning("Upload is paused");
              // console.log("Upload is paused");
              break;
            case "running":
              toast.info("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              toast.error("User doesn't have permission to access the object");
              setImageUploadProgress(null);
              break;
            case "storage/canceled":
              toast.error("Upload canceled");
              setImageUploadProgress(null);
              break;
            case "storage/unknown":
              toast.error("Unknown error occurred");
              setImageUploadProgress(null);
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.success("Image Upload successful");
            setImageUploadProgress(null);
            return setData({ ...data, image: downloadURL });
          });
        }
      );
    } catch (err) {
      // console.log(err);
      toast.error(err.message);
      setImageUploadProgress(null);
    }
  };
  const handleInputChnage = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  }
  const handleUpdatePostSubmit = async (e) => {
    e.preventDefault();
    // console.log(data);
    try{
      const res = await axios.patch(`/api/v1/post/update-post/${postId}`, data);
      if(res.data.success){
        toast.success(res.data.message);
        setFile(null);
        console.log(res.data);
      }
    }catch(err){
      toast.error(err.response.data.message);
    }

  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdatePostSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={data.title}
            onChange={handleInputChnage}
          />
          <Select
            value={data.category}
            id="category"
            onChange={handleInputChnage}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nodejs">Node.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            id="image"
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
            value={data.image}
          ></img>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          id="content"
          onChange={(val) => setData({ ...data, content: val })}
          value={data.content}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
        
        >
          Update
        </Button>
      </form>
    </div>
  );
}

export default UpdatePost;

   