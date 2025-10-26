import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { Task } from "../models/task.model.js";

dotenv.config();

const models = [Task];

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "todo_app",
  models,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connection established successfully");
    await sequelize.sync({ alter: false });
    console.log("✓ Database models synchronized");
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error);
    process.exit(1);
  }
};
