import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  TextInput,
  Spinner
} from "flowbite-react";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../features/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import OAuth from "../components/OAuth.jsx";
import { toast } from "react-toastify";
function SignIn() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { loading, error: errMsg } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value.trim();
    return setData({ ...data, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/v1/auth/sign-in", data);
      console.log(res);
     if(!res.data.success){
      toast.error(res.data.message);
      dispatch(signInFailure(res.data.message));
      return;
     }
      if (res.data.success) {
        dispatch(signInSuccess(res.data.data));
        toast.success(res.data.message);
        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response.data.message);
      dispatch(signInFailure(err.response.data.message));
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className=" font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white mr-1">
              Kavya's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is my demo project using MERN. You can sign in with your email
            and password or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={handleFormSubmit}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Your email" />
              </div>
              <TextInput
                id="email1"
                type="email"
                placeholder="email"
                name="email"
                value={data.email}
                required
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput
                id="password1"
                type="password"
                placeholder="password"
                name="password"
                value={data.password}
                required
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" gradientDuoTone="purpleToPink">
              {loading ? (
                <>
                  <Spinner color="purple" />
                  <span className="pl-3">Loading....</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
