import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { username, email, fullname, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const user = await User.create({
            username,
            email,
            fullname,
            password: passwordHash,
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        const { password: userPassword, ...userWithoutPassword } = user._doc;

        res.status(201).json(userWithoutPassword);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: "Internal server error occurred during signup",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcryptjs.compare(
            password,
            user?.password || ""
        );
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        const { password: userPassword, ...userWithoutPassword } = user._doc;
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: "Internal server error occurred during login",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: "Internal server error occurred during logout",
        });
    }
};
