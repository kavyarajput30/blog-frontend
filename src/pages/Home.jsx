import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
function Home() {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/v1/post/get-posts?limit=6");
      if (res.data.success) {
        setPosts(res.data.data.posts);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-6 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          I'm Kavya Rajput, a final year B.Tech student at Feroze Gandhi
          College, I am from Bijnore. i am deeply passionate about web
          development and coding. Through hands-on project work and relentless
          problem-solving, I've honed my skills in the MERN stack—MongoDB,
          Express.js, React.js, and Node.js and NExt.js.
        </p>
        <p className="text-gray-600 text-sm sm:text-md">
          In my Blog you will find variety of topics related tp MERN Stacka and
          Next.js
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View All Posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="flex flex-col pt-8 ">
        <h2 className="text-3xl font-semibold text-center">Recent Posts</h2>
        <div className=" max-w-8xl mx-auto p-3 flex flex-wrap gap-5 m-5 justify-center">
          {posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        <Link to={"/search"} className="text-lg text-teal-500 hover:underline text-center mb-4">View 
        All Posts</Link>
      </div>
    </div>
  );
}

export default Home;
