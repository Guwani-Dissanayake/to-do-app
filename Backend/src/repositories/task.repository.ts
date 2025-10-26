import { Task } from "../models/task.model.js";

export class TaskRepository {
  async findIncompleteTasks(limit: number = 5): Promise<Task[]> {
    return await Task.findAll({
      where: { completed: false },
      order: [["created_at", "DESC"]],
      limit,
    });
  }

  async findById(id: number): Promise<Task | null> {
    return await Task.findByPk(id);
  }

  async create(title: string, description?: string | null): Promise<Task> {
    return await Task.create({
      title,
      description: description || null,
    });
  }

  async update(task: Task): Promise<Task> {
    await Task.update(task, {
      where: { id: task.id },
    });
    return task;
  }

  async markAsCompleted(id: number): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) {
      return null;
    }
    const toUpdate = task.get();
    toUpdate.completed = true;
    return await this.update(toUpdate);
  }
}

export const taskRepository = new TaskRepository();
