import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';

// import routes
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"

dotenv.config({
  path: "./.env"
})

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json()) // allows us to parse JSON request bodies
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB()
})