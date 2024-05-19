import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import app from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
        const resultsFromGoogle = await signInWithPopup(auth, provider);
        const res = await axios.post("/api/v1/auth/google", {
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          photourl: resultsFromGoogle.user.photoURL
        }, {
          headers: {
            'Content-Type': 'application/json' // Corrected content type header
          }
        });

        if(res.data.success) {
            dispatch(signInSuccess(res.data.data));
            navigate('/');
        }
      } catch (e) {
        console.log(e);
      }console.log(e);
    }
  return (
    <Button
      type="button"
      outline
      gradientDuoTone="pinkToOrange"
      onClick={handleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" /> Continue with Google
    </Button>
  );
}

export default OAuth;
