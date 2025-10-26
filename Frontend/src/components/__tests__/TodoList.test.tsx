import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "../TodoList";
import { todoApi } from "../../services/todo.service";
import { Todo } from "../../types/todo.types";

jest.mock("../../services/todo.service", () => ({
  todoApi: {
    markTodoAsDone: jest.fn(),
  },
}));

describe("TodoList", () => {
  const sampleTodos: Todo[] = [
    {
      id: 1,
      title: "Task 1",
      description: "Desc 1",
      completed: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Task 2",
      completed: false,
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no todos", () => {
    const onTodoUpdated = jest.fn();
    render(<TodoList todos={[]} onTodoUpdated={onTodoUpdated} />);

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    expect(screen.getByText(/total: 0/i)).toBeInTheDocument();
  });

  it("renders items and total chip", () => {
    const onTodoUpdated = jest.fn();
    render(<TodoList todos={sampleTodos} onTodoUpdated={onTodoUpdated} />);

    expect(screen.getByText(/total: 2/i)).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("marks a todo as done and shows success snackbar", async () => {
    const onTodoUpdated = jest.fn();
    (todoApi.markTodoAsDone as jest.Mock).mockResolvedValue(undefined);
    render(<TodoList todos={sampleTodos} onTodoUpdated={onTodoUpdated} />);

    const list = screen.getByRole("list");
    const firstItem = within(list)
      .getByText("Task 1")
      .closest("li") as HTMLElement;
    const doneButton = within(firstItem).getByRole("button", { name: /done/i });

    await userEvent.click(doneButton);

    expect(todoApi.markTodoAsDone).toHaveBeenCalledWith(1);
    await screen.findByText(/todo marked as done/i);
    expect(onTodoUpdated).toHaveBeenCalled();
  });

  it("disables button while loading", async () => {
    const onTodoUpdated = jest.fn();
    let resolveFn: (v?: any) => void = () => {};
    (todoApi.markTodoAsDone as jest.Mock).mockImplementation(
      () => new Promise((resolve) => (resolveFn = resolve))
    );

    render(<TodoList todos={sampleTodos} onTodoUpdated={onTodoUpdated} />);

    const list = screen.getByRole("list");
    const firstItem = within(list)
      .getByText("Task 1")
      .closest("li") as HTMLElement;
    const doneButton = within(firstItem).getByRole("button", {
      name: /done|marking/i,
    });

    await userEvent.click(doneButton);

    expect(doneButton).toBeDisabled();
    expect(doneButton).toHaveTextContent(/marking/i);

    resolveFn && resolveFn(undefined);
    await waitFor(() => expect(doneButton).not.toBeDisabled());
    expect(doneButton).toHaveTextContent(/done/i);
  });
});
