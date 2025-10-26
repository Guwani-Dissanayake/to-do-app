import { jest } from "@jest/globals";
import { TaskService } from "../../services/task.service.js";
import { taskRepository } from "../../repositories/task.repository.js";
import { Task } from "../../models/task.model.js";
import Logger from "../../utils/logger.js";

describe("TaskService", () => {
  let service: TaskService;
  let mockTask: Partial<Task>;

  beforeEach(() => {
    service = new TaskService();
    mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      completed: false,
      created_at: new Date(),
    };
    jest.clearAllMocks();
    jest.spyOn(Logger, "error").mockImplementation(() => {});
    jest.spyOn(Logger, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getIncompleteTasks", () => {
    it("should return incomplete tasks with default limit", async () => {
      const mockTasks = [mockTask as Task, { ...mockTask, id: 2 } as Task];
      jest
        .spyOn(taskRepository, "findIncompleteTasks")
        .mockResolvedValue(mockTasks as Task[]);

      const result = await service.getIncompleteTasks();

      expect(taskRepository.findIncompleteTasks).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockTasks);
    });

    it("should return incomplete tasks with custom limit", async () => {
      const mockTasks = [mockTask as Task];
      jest
        .spyOn(taskRepository, "findIncompleteTasks")
        .mockResolvedValue(mockTasks as Task[]);

      const result = await service.getIncompleteTasks(10);

      expect(taskRepository.findIncompleteTasks).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockTasks);
    });

    it("should throw error when repository fails", async () => {
      jest
        .spyOn(taskRepository, "findIncompleteTasks")
        .mockRejectedValue(new Error("Database error"));

      await expect(service.getIncompleteTasks()).rejects.toThrow(
        "Failed to fetch incomplete tasks"
      );
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      jest.spyOn(taskRepository, "create").mockResolvedValue(mockTask as Task);

      const result = await service.createTask({
        title: "Test Task",
        description: "Test Description",
      });

      expect(taskRepository.create).toHaveBeenCalledWith(
        "Test Task",
        "Test Description"
      );
      expect(result).toEqual(mockTask);
      expect(Logger.info).toHaveBeenCalledWith("Task created: 1 - Test Task");
    });

    it("should trim whitespace from title and description", async () => {
      jest.spyOn(taskRepository, "create").mockResolvedValue(mockTask as Task);

      await service.createTask({
        title: "  Test Task  ",
        description: "  Test Description  ",
      });

      expect(taskRepository.create).toHaveBeenCalledWith(
        "Test Task",
        "Test Description"
      );
    });

    it("should throw error when title is empty", async () => {
      await expect(service.createTask({ title: "" })).rejects.toMatchObject({
        message: "Title is required",
        statusCode: 400,
      });
    });

    it("should throw error when title is only whitespace", async () => {
      await expect(service.createTask({ title: "   " })).rejects.toMatchObject({
        message: "Title is required",
        statusCode: 400,
      });
    });

    it("should handle null description", async () => {
      jest.spyOn(taskRepository, "create").mockResolvedValue(mockTask as Task);

      await service.createTask({ title: "Test Task" });

      expect(taskRepository.create).toHaveBeenCalledWith("Test Task", null);
    });

    it("should throw error when repository fails", async () => {
      jest
        .spyOn(taskRepository, "create")
        .mockRejectedValue(new Error("Database error"));

      await expect(service.createTask({ title: "Test Task" })).rejects.toThrow(
        "Failed to create task"
      );
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe("markTaskAsCompleted", () => {
    it("should mark task as completed successfully", async () => {
      const completedTask = { ...mockTask, completed: true } as Task;
      jest
        .spyOn(taskRepository, "markAsCompleted")
        .mockResolvedValue(completedTask as Task);

      const result = await service.markTaskAsCompleted(1);

      expect(taskRepository.markAsCompleted).toHaveBeenCalledWith(1);
      expect(result).toEqual(completedTask);
      expect(Logger.info).toHaveBeenCalledWith(
        "Task marked as completed: 1 - Test Task"
      );
    });

    it("should throw 404 error when task not found", async () => {
      jest.spyOn(taskRepository, "markAsCompleted").mockResolvedValue(null);

      await expect(service.markTaskAsCompleted(999)).rejects.toMatchObject({
        message: "Task not found",
        statusCode: 404,
      });
    });

    it("should throw error when repository fails", async () => {
      jest
        .spyOn(taskRepository, "markAsCompleted")
        .mockRejectedValue(new Error("Database error"));

      const errorSpy = jest.spyOn(Logger, "error").mockImplementation(() => {});

      await expect(service.markTaskAsCompleted(1)).rejects.toThrow(
        "Failed to mark task as completed"
      );
      expect(Logger.error).toHaveBeenCalled();
    });
  });
});
