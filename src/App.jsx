import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Project from "./pages/Project.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";
import NavbarPage from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Routes, Route } from "react-router-dom";
import CreatePost from "./pages/CreatePost.jsx";
import axios from "axios";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PostPage from "./pages/PostPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Search from "./pages/Search.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  axios.defaults.baseURL = "https://mern-blog-app-1-8u82.onrender.com/";
  axios.defaults.withCredentials = true;
  return (
    <>
      <ScrollToTop />
      <NavbarPage />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/project" element={<Project />} />
        <Route path="post/:postSlug" element={<PostPage />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
      />
    </>
  );
}

export default App;
