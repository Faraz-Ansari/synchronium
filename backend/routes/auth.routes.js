import { Router } from "express";
import {
    signup,
    login,
    logout,
    userInfo,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router.get("/user-info", protectRoute, userInfo);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
