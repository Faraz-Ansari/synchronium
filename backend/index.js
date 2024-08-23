import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import notificationRouter from "./routes/notification.routes.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.error(err.message);
    });

const app = express();
const __dirname = path.resolve();
const port = 3000;

// middleware for parsing json and urlencoded data from the request body
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// middleware for parsing cookies
app.use(cookieParser());

// Middleware for serving static files through the express router
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notification", notificationRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "/frontend/dist")));

    app.use("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
