import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/create", protectRoute, createOrder)
router.get("/admin", protectRoute, adminRoute, getOrders)

export default router;