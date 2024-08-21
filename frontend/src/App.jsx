import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import Home from "./pages/home/Home";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import SideBar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
    const {
        // IMPORTANT: 'data' or 'authUser' is the user object if the user is authenticated,
        // it will be used to make routes private.
        // so if 'authUser' exists then the user is authenticated and we will show the private routes
        // if 'authUser' is null then the user is not authenticated so we will redirect the user to the login page

        data: authUser,
        isLoading,
    } = useQuery({
        // queryKey is set to ["authUser"] so that the query will be refetched when the user logs in or logs out
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const response = await fetch("/api/auth/user-info");
                const data = await response.json();

                // If the user is not authenticated then return null making 'authUser' null
                if (data.message === "No token provided") {
                    return null;
                }

                if (!response.ok) {
                    throw new Error(data.message);
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex max-w-6xl mx-auto">
            {authUser && <SideBar />}
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <Login /> : <Navigate to="/" />}
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignUp /> : <Navigate to="/" />}
                />
                <Route
                    path="/notifications"
                    element={
                        authUser ? (
                            <NotificationPage />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to="/login" />
                    }
                />
            </Routes>
            {authUser && <RightPanel />}
            <Toaster />
        </div>
    );
}
