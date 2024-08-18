import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
    createPost,
    deletePost,
    toggleLike,
    commentOnPost,
    fetchAllPosts,
    fetchLikedPosts,
    fetchFollowingPosts,
    fetchUserPosts,
} from "../controllers/post.controller.js";

const router = Router();

router.get("/posts", protectRoute, fetchAllPosts);
router.get("/liked-posts/:id", protectRoute, fetchLikedPosts);
router.get("/following-feed", protectRoute, fetchFollowingPosts);
router.get("/user-posts/:username", protectRoute, fetchUserPosts);
router.post("/create-post", protectRoute, createPost);
router.post("/toggle-like/:id", protectRoute, toggleLike);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/delete-post/:id", protectRoute, deletePost);

export default router;
