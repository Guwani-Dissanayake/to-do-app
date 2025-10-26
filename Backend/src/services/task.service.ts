import { Task } from "../models/task.model.js";
import { taskRepository } from "../repositories/task.repository.js";
import Logger from "../utils/logger.js";

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface TaskServiceError {
  message: string;
  statusCode: number;
}

export class TaskService {
  async getIncompleteTasks(limit: number = 5): Promise<Task[]> {
    try {
      return await taskRepository.findIncompleteTasks(limit);
    } catch (error) {
      Logger.error("Error in getIncompleteTasks:", error);
      throw new Error("Failed to fetch incomplete tasks");
    }
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    try {
      // Validate input
      if (!data.title || data.title.trim().length === 0) {
        const error = new Error("Title is required") as Error & {
          statusCode: number;
        };
        error.statusCode = 400;
        throw error;
      }

      // Create task
      const task = await taskRepository.create(
        data.title.trim(),
        data.description?.trim() || null
      );

      Logger.info(`Task created: ${task.id} - ${task.title}`);
      return task;
    } catch (error) {
      if ((error as any).statusCode === 400) {
        throw error;
      }
      Logger.error("Error in createTask:", error);
      throw new Error("Failed to create task");
    }
  }

  async markTaskAsCompleted(id: number): Promise<Task> {
    try {
      const task = await taskRepository.markAsCompleted(id);

      if (!task) {
        const error = new Error("Task not found") as Error & {
          statusCode: number;
        };
        error.statusCode = 404;
        throw error;
      }

      Logger.info(`Task marked as completed: ${task.id} - ${task.title}`);
      return task;
    } catch (error) {
      if ((error as any).statusCode === 404) {
        throw error;
      }
      Logger.error("Error in markTaskAsCompleted:", error);
      throw new Error("Failed to mark task as completed");
    }
  }
}

export const taskService = new TaskService();
