import React from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutSuccess } from "../features/user/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiChartPie } from "react-icons/hi2";
function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromurl = urlParams.get("tab");
    if (tabFromurl) {
      setTab(tabFromurl);
    }
  }, [location.search]);
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
    <Sidebar className="w-full md:w-56" aria-label="Sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Sidebar.Item
            href="/dashboard?tab=profile"
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser?.isAdmin ? "Admin" : "User"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          {currentUser?.isAdmin && (
            <Sidebar.Item
              href="/dashboard?tab=posts"
              active={tab === "posts"}
              icon={HiDocumentText}
              labelColor="dark"
            >
              Posts
            </Sidebar.Item>
          )}
           {currentUser?.isAdmin && (
            <Sidebar.Item
              href="/dashboard?tab=users"
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              labelColor="dark"
            >
              Users
            </Sidebar.Item>
          )}
            {currentUser?.isAdmin && (
            <Sidebar.Item
              href="/dashboard?tab=dashboard"
              active={tab === "dashboard" || tab === ""}
              icon={HiChartPie}
              labelColor="dark"
            >
              Dashboard
            </Sidebar.Item>
          )}



          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handlelogOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
