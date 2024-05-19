// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-app-75712.firebaseapp.com",
  projectId: "mern-blog-app-75712",
  storageBucket: "mern-blog-app-75712.appspot.com",
  messagingSenderId: "222978671237",
  appId: "1:222978671237:web:eecb7159958381ad51dfec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app