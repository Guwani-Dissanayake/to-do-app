import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { todoRoutes } from "./routes/todo.routes.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`✓ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
