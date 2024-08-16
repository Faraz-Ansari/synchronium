import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.error(err.message);
    });

const app = express();

const PORT = 3000;

// middleware for parsing json and urlencoded data from the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware for parsing cookies
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
