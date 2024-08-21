import { Link } from "react-router-dom";
import { useState } from "react";

// Logo SVG file
import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const navigateTo = useNavigate();

    const {
        mutate: signupMutation,
        isError,
        error,
        isPending,
    } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            try {
                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        fullName,
                        password,
                    }),
                });

                const data = await response.json();

                console.log(data);
                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong!");
                }
                toast.success("Account created successfully");
                navigateTo("/login");

                return data;
            } catch (error) {
                throw error;
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signupMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
            <div className="flex-1 hidden lg:flex items-center  justify-center">
                <XSvg className=" lg:w-2/3 fill-white" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
                <form
                    className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}
                >
                    <XSvg className="w-24 lg:hidden fill-white" />
                    <h1 className="text-4xl font-extrabold text-white">
                        Join today.
                    </h1>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdOutlineMail />
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            name="email"
                            required
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className="flex gap-4 flex-wrap">
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <FaUser />
                            <input
                                type="text"
                                className="grow "
                                placeholder="Username"
                                name="username"
                                required
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <MdDriveFileRenameOutline />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Full Name"
                                name="fullName"
                                required
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdPassword />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            required
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className="btn rounded-full btn-primary uppercase text-white">
                        {isPending ? "Loading..." : "Sign up"}
                    </button>
                    {isError && <p className="text-red-500">{error.message}</p>}
                </form>
                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg">
                        Already have an account?
                    </p>
                    <Link to="/login">
                        <button className="btn rounded-full uppercase btn-primary text-white btn-outline w-full">
                            Log in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
