import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "../TodoForm";
import { todoApi } from "../../services/todo.service";

jest.mock("../../services/todo.service", () => ({
  todoApi: {
    createTodo: jest.fn(),
  },
}));

describe("TodoForm", () => {
  const setup = () => {
    const onTodoCreated = jest.fn();
    render(<TodoForm onTodoCreated={onTodoCreated} />);
    const titleInput = screen.getByLabelText(/todo title/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(
      /description \(optional\)/i
    ) as HTMLTextAreaElement;
    const submitBtn = screen.getByRole("button", {
      name: /add todo|creating/i,
    });
    return { onTodoCreated, titleInput, descInput, submitBtn };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("submits valid form and shows success snackbar", async () => {
    (todoApi.createTodo as jest.Mock).mockResolvedValue({ id: 1 });
    const { onTodoCreated, titleInput, descInput, submitBtn } = setup();

    await userEvent.type(titleInput, "New Task");
    await userEvent.type(descInput, "Some description");
    await userEvent.click(submitBtn);

    expect(todoApi.createTodo).toHaveBeenCalledWith({
      title: "New Task",
      description: "Some description",
    });
    await screen.findByText(/todo created successfully/i);
    expect(onTodoCreated).toHaveBeenCalled();

    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(descInput.value).toBe("");
    });
  });

  it("shows error snackbar when API fails", async () => {
    (todoApi.createTodo as jest.Mock).mockRejectedValue(new Error("boom"));
    const { submitBtn } = setup();

    await userEvent.type(screen.getByLabelText(/todo title/i), "X");
    await userEvent.click(submitBtn);

    await screen.findByText(/failed to create todo/i);
  });

  it("disables submit while loading and shows spinner", async () => {
    let resolveFn: (v?: any) => void = () => {};
    (todoApi.createTodo as jest.Mock).mockImplementation(
      () => new Promise((resolve) => (resolveFn = resolve))
    );

    const { submitBtn } = setup();

    await userEvent.type(screen.getByLabelText(/todo title/i), "Loading Task");
    await userEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/creating/i);

    resolveFn && resolveFn({ id: 1 });

    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    expect(submitBtn).toHaveTextContent(/add todo/i);
  });
});
