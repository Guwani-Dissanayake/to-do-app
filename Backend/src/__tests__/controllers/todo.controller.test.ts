import { jest } from "@jest/globals";
import type { Request, Response } from "express";
import {
  getTodos,
  createTodo,
  markTodoAsDone,
} from "../../controllers/todo.controller.js";
import { taskService } from "../../services/task.service.js";
import { Task } from "../../models/task.model.js";

describe("TodoController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
  let mockTask: Partial<Task>;

  beforeEach(() => {
    mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      completed: false,
      created_at: new Date(),
    };

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    it("should return incomplete tasks", async () => {
      const mockTasks = [mockTask as Task, { ...mockTask, id: 2 } as Task];
      jest
        .spyOn(taskService, "getIncompleteTasks")
        .mockResolvedValue(mockTasks as Task[]);

      await getTodos(mockRequest as Request, mockResponse as Response);

      expect(taskService.getIncompleteTasks).toHaveBeenCalledWith(5);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should handle service errors", async () => {
      const error = new Error("Service error") as Error & {
        statusCode?: number;
      };
      error.statusCode = 500;
      jest.spyOn(taskService, "getIncompleteTasks").mockRejectedValue(error);

      await getTodos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });

    it("should handle errors without status code", async () => {
      jest
        .spyOn(taskService, "getIncompleteTasks")
        .mockRejectedValue(new Error("Unknown error"));

      await getTodos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unknown error",
      });
    });
  });

  describe("createTodo", () => {
    it("should create a task successfully", async () => {
      mockRequest.body = {
        title: "New Task",
        description: "New Description",
      };
      jest.spyOn(taskService, "createTask").mockResolvedValue(mockTask as Task);

      await createTodo(mockRequest as Request, mockResponse as Response);

      expect(taskService.createTask).toHaveBeenCalledWith({
        title: "New Task",
        description: "New Description",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it("should handle validation errors", async () => {
      mockRequest.body = { title: "" };
      const error = new Error("Title is required") as Error & {
        statusCode?: number;
      };
      error.statusCode = 400;
      jest.spyOn(taskService, "createTask").mockRejectedValue(error);

      await createTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Title is required",
      });
    });

    it("should handle service errors", async () => {
      mockRequest.body = { title: "Test" };
      const error = new Error("Service error") as Error & {
        statusCode?: number;
      };
      error.statusCode = 500;
      jest.spyOn(taskService, "createTask").mockRejectedValue(error);

      await createTodo(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("markTodoAsDone", () => {
    it("should mark task as completed successfully", async () => {
      mockRequest.params = { id: "1" };
      const completedTask = { ...mockTask, completed: true } as Task;
      jest
        .spyOn(taskService, "markTaskAsCompleted")
        .mockResolvedValue(completedTask as Task);

      await markTodoAsDone(mockRequest as Request, mockResponse as Response);

      expect(taskService.markTaskAsCompleted).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Todo marked as done",
        task: completedTask,
      });
    });

    it("should handle task not found", async () => {
      mockRequest.params = { id: "999" };
      const error = new Error("Task not found") as Error & {
        statusCode?: number;
      };
      error.statusCode = 404;
      jest.spyOn(taskService, "markTaskAsCompleted").mockRejectedValue(error);

      await markTodoAsDone(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Task not found",
      });
    });

    it("should handle service errors", async () => {
      mockRequest.params = { id: "1" };
      const error = new Error("Service error") as Error & {
        statusCode?: number;
      };
      error.statusCode = 500;
      jest.spyOn(taskService, "markTaskAsCompleted").mockRejectedValue(error);

      await markTodoAsDone(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });

    it("should handle invalid ID format", async () => {
      mockRequest.params = { id: "1" };
      jest
        .spyOn(taskService, "markTaskAsCompleted")
        .mockResolvedValue(mockTask as Task);

      await markTodoAsDone(mockRequest as Request, mockResponse as Response);

      expect(taskService.markTaskAsCompleted).toHaveBeenCalledWith(1);
    });
  });
});
