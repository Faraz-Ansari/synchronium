import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { fetchNotifications, deleteNotifications } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", protectRoute, fetchNotifications);
router.delete("/", protectRoute, deleteNotifications);

export default router;