import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
    createPost,
    deletePost,
    toggleLike,
    commentOnPost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create-post", protectRoute, createPost);
router.post("/toggle-like/:id", protectRoute, toggleLike);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/delete-post", protectRoute, deletePost);

export default router;
