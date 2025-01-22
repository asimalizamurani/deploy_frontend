import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';

// import routes
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponsRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
import orderRoutes from "./routes/order.route.js";

import cors from "cors"

dotenv.config({
  path: "./.env"
})

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json({limit: "10mb"})) // allows us to parse JSON request bodies
app.use(cookieParser())
// Use CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow requests from this origin
  // methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponsRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB()
})