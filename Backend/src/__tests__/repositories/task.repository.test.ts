import { jest } from "@jest/globals";
import { Task } from "../../models/task.model.js";
import { TaskRepository } from "../../repositories/task.repository.js";

describe("TaskRepository", () => {
  let repository: TaskRepository;
  let mockTask: Partial<Task>;

  beforeEach(() => {
    repository = new TaskRepository();
    mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      completed: false,
      created_at: new Date(),
    };
    jest.clearAllMocks();
  });

  describe("findIncompleteTasks", () => {
    it("should return incomplete tasks with default limit", async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      jest.spyOn(Task, "findAll").mockResolvedValue(mockTasks as any);

      const result = await repository.findIncompleteTasks();

      expect(Task.findAll).toHaveBeenCalledWith({
        where: { completed: false },
        order: [["created_at", "DESC"]],
        limit: 5,
      });
      expect(result).toEqual(mockTasks);
    });

    it("should return incomplete tasks with custom limit", async () => {
      const mockTasks = [mockTask];
      jest.spyOn(Task, "findAll").mockResolvedValue(mockTasks as any);

      const result = await repository.findIncompleteTasks(10);

      expect(Task.findAll).toHaveBeenCalledWith({
        where: { completed: false },
        order: [["created_at", "DESC"]],
        limit: 10,
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe("findById", () => {
    it("should return a task when found", async () => {
      jest.spyOn(Task, "findByPk").mockResolvedValue(mockTask as any);

      const result = await repository.findById(1);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it("should return null when task not found", async () => {
      jest.spyOn(Task, "findByPk").mockResolvedValue(null as any);

      const result = await repository.findById(999);

      expect(Task.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a task with title only", async () => {
      jest.spyOn(Task, "create").mockResolvedValue(mockTask as any);

      const result = await repository.create("Test Task");

      expect(Task.create).toHaveBeenCalledWith({
        title: "Test Task",
        description: null,
      });
      expect(result).toEqual(mockTask);
    });

    it("should create a task with title and description", async () => {
      jest.spyOn(Task, "create").mockResolvedValue(mockTask as any);

      const result = await repository.create("Test Task", "Test Description");

      expect(Task.create).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
      });
      expect(result).toEqual(mockTask);
    });

    it("should create a task with null description when empty string provided", async () => {
      jest.spyOn(Task, "create").mockResolvedValue(mockTask as any);

      const result = await repository.create("Test Task", "");

      expect(Task.create).toHaveBeenCalledWith({
        title: "Test Task",
        description: null,
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe("update", () => {
    it("should save and return the updated task", async () => {
      const taskInstance = mockTask as Task;

      const result = await repository.update(taskInstance);

      expect(taskInstance.save).toHaveBeenCalled();
      expect(result).toEqual(taskInstance);
    });
  });

  describe("markAsCompleted", () => {
    it("should mark task as completed and return it", async () => {
      const taskInstance = { ...mockTask, completed: false } as Task;
      jest.spyOn(Task, "findByPk").mockResolvedValue(taskInstance as any);

      const result = await repository.markAsCompleted(1);

      expect(Task.findByPk).toHaveBeenCalledWith(1);
      expect(taskInstance.completed).toBe(true);
      expect(taskInstance.save).toHaveBeenCalled();
      expect(result).toEqual(taskInstance);
    });

    it("should return null when task not found", async () => {
      jest.spyOn(Task, "findByPk").mockResolvedValue(null as any);

      const result = await repository.markAsCompleted(999);

      expect(Task.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
