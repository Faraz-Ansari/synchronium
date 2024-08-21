import { Routes, Route } from "react-router-dom";

import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import Home from "./pages/home/Home";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import SideBar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <div className="flex max-w-6xl mx-auto">
            <SideBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
            <RightPanel />
            <Toaster />
        </div>
    );
}
