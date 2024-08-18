import { Router } from "express";
import {
    getUserProfile,
    toggleFollow,
    updateUserProfile,
    getSuggestedUsers,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested-users", protectRoute, getSuggestedUsers);
router.post("/toggle-follow/:id", protectRoute, toggleFollow);
router.post("/update", protectRoute, updateUserProfile);

export default router;
