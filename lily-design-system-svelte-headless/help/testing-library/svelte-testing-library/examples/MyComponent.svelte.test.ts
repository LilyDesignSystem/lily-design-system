import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { expect, test } from "vitest";

import Subject from "./MyComponent.svelte.svelte";

test("no initial greeting", (): void => {
  render(Subject, { name: "World" });

  const button: HTMLElement = screen.getByRole("button", { name: "Greet" });
  const greeting: HTMLElement | null = screen.queryByText(/hello/iu);

  expect(button).toBeTruthy();
  expect(greeting).toBeNull();
});

test("greeting appears on click", async (): Promise<void> => {
  const user: UserEvent = userEvent.setup();
  render(Subject, { name: "World" });

  const button: HTMLElement = screen.getByRole("button");
  await user.click(button);
  const greeting: HTMLElement = screen.getByText(/hello world/iu);

  expect(greeting).toBeTruthy();
});
