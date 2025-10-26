import type { Request, Response } from "express";
import { taskService } from "../services/task.service.js";

// Get recent 5 todos
export const getTodos = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getIncompleteTasks(5);
    res.json(tasks);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error fetching todos" });
  }
};

// Create a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    const task = await taskService.createTask({ title, description });

    res.status(201).json(task);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error creating todo" });
  }
};

// Mark todo as done
export const markTodoAsDone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await taskService.markTaskAsCompleted(Number(id));

    res.json({ message: "Todo marked as done", task });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error updating todo" });
  }
};
