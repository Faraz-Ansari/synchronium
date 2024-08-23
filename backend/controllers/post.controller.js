import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;

        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!img && !text) {
            return res.status(400).json({ message: "Post cannot be empty" });
        }

        if (img) {
            const response = await cloudinary.uploader.upload(img);
            img = response.secure_url;
        }

        const post = await Post.create({
            text,
            img,
            user: userId,
        });

        res.status(201).json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during commenting",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user.id.toString()) {
            return res
                .status(401)
                .json({ message: "You can only delete your own post" });
        }

        // Delete the post image from cloudinary if it exists
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during post deletion",
        });
    }
};

export const toggleLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike the post by removing the user's ID from the post's likes array
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

            // Remove the post's ID from the user's likedPosts array
            await User.findByIdAndUpdate(userId, {
                $pull: { likedPosts: postId },
            });

            const updatedLikes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
            res.status(200).json({
                updatedLikes,
                message: "Post unliked successfully",
            });
        } else {
            // Like the post by adding the user's ID to the post's likes array
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

            // Add the post's ID to the user's likedPosts array
            await User.findByIdAndUpdate(userId, {
                $push: { likedPosts: postId },
            });
            await Notification.create({
                from: userId,
                to: post.user,
                type: "like",
            });

            const updatedLikes = post.likes;
            res.status(200).json({
                updatedLikes,
                message: "Post liked successfully",
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during liking or unlinking post",
        });
    }
};

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        if (!text) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = {
            text,
            user: userId,
        };

        post.comments.push(comment);
        const newComment = await Post.findByIdAndUpdate(postId, post, {
            new: true,
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during commenting",
        });
    }
};

export const fetchAllPosts = async (req, res) => {
    try {
        // Fetch all posts from the database
        const posts = await Post.find()
            // Sort posts by creation date in descending order i.e. latest post first
            .sort({ createdAt: -1 })
            // Populate the 'user' field in each post, excluding the password
            .populate({
                path: "user",
                select: "-password",
            })
            // Populate the 'user' field in each comment, excluding the password
            .populate({
                path: "comments.user",
                select: "-password",
            });
        if (posts.length === 0) {
            return res.status(200).json({ message: "No posts found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during fetching posts",
        });
    }
};

export const fetchLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Find all posts whose IDs are in the user's likedPosts array
        const likedPosts = await Post.find({
            _id: { $in: user.likedPosts },
        })
            // Populate the 'user' field in each post, excluding the password
            .populate({
                path: "user",
                select: "-password",
            })
            // Populate the 'user' field in each comment, excluding the password
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during fetching liked posts",
        });
    }
};

export const fetchFollowingPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all posts from users that the current user is following
        const followingPosts = await Post.find({
            user: { $in: user.following },
        })
            // Sort the posts by creation date in descending order
            .sort({ createdAt: -1 })
            // Populate the 'user' field in each post, excluding the password
            .populate({
                path: "user",
                select: "-password",
            })
            // Populate the 'user' field in each comment, excluding the password
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(followingPosts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during fetching following posts",
        });
    }
};

export const fetchUserPosts = async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all posts created by the specified user
        const posts = await Post.find({ user: user._id })
            // Sort the posts by creation date in descending order
            .sort({ createdAt: -1 })
            // Populate the 'user' field in each post, excluding the password
            .populate({
                path: "user",
                select: "-password",
            })
            // Populate the 'user' field in each comment, excluding the password
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error during fetching user posts",
        });
    }
};
