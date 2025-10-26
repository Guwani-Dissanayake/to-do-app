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
    it("should call Task.update and return the updated task", async () => {
      const taskInstance = mockTask as Task;
      const updateSpy = jest
        .spyOn(Task, "update")
        // Sequelize returns [affectedCount, affectedRows?] in some dialects
        .mockResolvedValue([1] as any);

      const result = await repository.update(taskInstance as any);

      expect(updateSpy).toHaveBeenCalledWith(taskInstance, {
        where: { id: taskInstance.id },
      });
      expect(result).toEqual(taskInstance);
    });
  });

  describe("markAsCompleted", () => {
    it("should mark task as completed and persist via Task.update", async () => {
      // Simulate a Sequelize instance with get()
      const plain = { ...(mockTask as any), completed: false };
      const instance = {
        get: jest.fn().mockReturnValue({ ...plain }),
      } as unknown as Task;

      const findSpy = jest
        .spyOn(Task, "findByPk")
        .mockResolvedValue(instance as any);
      const updateSpy = jest
        .spyOn(Task, "update")
        .mockResolvedValue([1] as any);

      const result = await repository.markAsCompleted(1);

      expect(findSpy).toHaveBeenCalledWith(1);
      expect(instance.get).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, completed: true }),
        { where: { id: 1 } }
      );
      expect(result).toEqual(
        expect.objectContaining({ id: 1, completed: true })
      );
    });

    it("should return null when task not found", async () => {
      jest.spyOn(Task, "findByPk").mockResolvedValue(null as any);

      const result = await repository.markAsCompleted(999);

      expect(Task.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
