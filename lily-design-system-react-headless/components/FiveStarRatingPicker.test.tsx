import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FiveStarRatingPicker";

describe("FiveStarRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(<Subject label="Rating" />);
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(<Subject label="Rating" />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("clicking a star selects it", async () => {
    const user: UserEvent = userEvent.setup();
    render(<Subject label="Rating" />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(true);
  });

  test("supports disabled", () => {
    render(<Subject label="Rating" disabled data-testid="r" />);
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(<Subject label="Rating" data-testid="r" />);
    expect(screen.getByTestId("r")).toBeTruthy();
  });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(ui: React.ReactElement): HTMLFormElement {
  const { container } = render(<form>{ui}</form>);
  return container.querySelector("form")!;
}

const afterReset = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

describe("form reset", () => {
  test("a form reset restores the initial value and reports it to the consumer", async () => {
    const onChange = vi.fn();
    const form = inForm(<Subject label="Rating" name="rating" value={3} onChange={onChange} />);
    fireEvent.click(form.querySelector<HTMLInputElement>('input[value="5"]')!);
    expect(onChange).toHaveBeenLastCalledWith(5);
    form.reset();
    await afterReset();
    expect(onChange).toHaveBeenLastCalledWith(3);
    expect(form.querySelector<HTMLInputElement>("input:checked")?.value).toBe("3");
    expect(new FormData(form).get("rating")).toBe("3");
  });

  test("a cancelled reset changes nothing", async () => {
    const onChange = vi.fn();
    const form = inForm(<Subject label="Rating" name="rating" value={3} onChange={onChange} />);
    fireEvent.click(form.querySelector<HTMLInputElement>('input[value="5"]')!);
    form.addEventListener("reset", (event) => event.preventDefault());
    form.reset();
    await afterReset();
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(new FormData(form).get("rating")).toBe("5");
  });
});

describe("no English default", () => {
  test("without starLabel the options are the numbers alone", () => {
    render(<Subject label="Rating" />);
    expect(screen.getByLabelText("3")).toBeTruthy();
    expect(screen.queryByText(/stars?/)).toBeNull();
  });

  test("starLabel supplies each option's text", () => {
    render(<Subject label="Rating" starLabel={(n: number) => (n === 1 ? "1 étoile" : `${n} étoiles`)} />);
    expect(screen.getByLabelText("1 étoile")).toBeTruthy();
    expect(screen.getByLabelText("4 étoiles")).toBeTruthy();
  });
});
