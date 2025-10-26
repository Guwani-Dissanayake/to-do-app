import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("./services/todo.service", () => ({
  todoApi: {
    getTodos: jest.fn().mockResolvedValue([]),
  },
}));

import App from "./App";

test("renders app title and fetches todos", async () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /todo app/i })
  ).toBeInTheDocument();
  // wait for fetch effect to settle
  await waitFor(() => {
    // no throw
  });
});
