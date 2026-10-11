import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./FiveFaceRatingPicker";

describe("FiveFaceRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(<Subject label="Experience" />);
    expect(screen.getByRole("radiogroup", { name: "Experience" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(<Subject label="Experience" />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("has all 5 default labels", () => {
    render(<Subject label="Experience" labels={["Very bad", "Bad", "Okay", "Good", "Very good"]} />);
    expect(screen.getByText("Very bad")).toBeTruthy();
    expect(screen.getByText("Bad")).toBeTruthy();
    expect(screen.getByText("Okay")).toBeTruthy();
    expect(screen.getByText("Good")).toBeTruthy();
    expect(screen.getByText("Very good")).toBeTruthy();
  });

  test("supports custom labels", () => {
    render(<Subject label="E" labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]} />);
    expect(screen.getByText("Terrible")).toBeTruthy();
    expect(screen.getByText("Poor")).toBeTruthy();
    expect(screen.getByText("Fair")).toBeTruthy();
    expect(screen.getByText("Great")).toBeTruthy();
    expect(screen.getByText("Excellent")).toBeTruthy();
  });

  test("clicking selects a face", async () => {
    const user: UserEvent = userEvent.setup();
    render(<Subject label="Experience" />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[3]);
    expect(radios[3].checked).toBe(true);
  });

  test("uses default name for form submission", () => {
    render(<Subject label="Experience" />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("face-rating");
  });

  test("supports custom name", () => {
    render(<Subject label="Experience" name="satisfaction" />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("satisfaction");
  });

  test("supports disabled", () => {
    render(<Subject label="Experience" disabled data-testid="r" />);
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("disabled radios cannot be clicked", async () => {
    const user: UserEvent = userEvent.setup();
    render(<Subject label="Experience" disabled />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(false);
  });

  test("no radio is checked by default", () => {
    render(<Subject label="Experience" />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const checked = radios.filter((r) => r.checked);
    expect(checked).toHaveLength(0);
  });

  test("passes through attributes", () => {
    render(<Subject label="E" data-testid="fr" />);
    expect(screen.getByTestId("fr")).toBeTruthy();
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
    const form = inForm(<Subject label="Rating" name="face" value={2} onChange={onChange} />);
    fireEvent.click(form.querySelector<HTMLInputElement>('input[value="4"]')!);
    expect(onChange).toHaveBeenLastCalledWith(4);
    form.reset();
    await afterReset();
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(form.querySelector<HTMLInputElement>("input:checked")?.value).toBe("2");
    expect(new FormData(form).get("face")).toBe("2");
  });

  test("a cancelled reset changes nothing", async () => {
    const onChange = vi.fn();
    const form = inForm(<Subject label="Rating" name="face" value={2} onChange={onChange} />);
    fireEvent.click(form.querySelector<HTMLInputElement>('input[value="4"]')!);
    form.addEventListener("reset", (event) => event.preventDefault());
    form.reset();
    await afterReset();
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(new FormData(form).get("face")).toBe("4");
  });
});

describe("no English default", () => {
  test("without labels the options are the numbers 1 to 5", () => {
    render(<Subject label="Feedback" />);
    for (const n of ["1", "2", "3", "4", "5"]) expect(screen.getByLabelText(n)).toBeTruthy();
    expect(screen.queryByText(/bad|good|okay/i)).toBeNull();
  });
});
