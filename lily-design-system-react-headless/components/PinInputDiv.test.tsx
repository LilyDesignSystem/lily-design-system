import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import type React from "react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./PinInputDiv";

describe("PinInputDiv", () => {
  test("renders a group element with aria-label", () => {
    render(<Subject label="Enter PIN" />);

    const group = screen.getByRole("group");
    expect(group.getAttribute("aria-label")).toBe("Enter PIN");
  });

  test("renders 4 digit inputs by default", () => {
    render(<Subject label="Enter PIN" />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(4);
  });

  test("renders custom number of digit inputs", () => {
    render(<Subject label="Enter Code" length={6} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(6);
  });

  test("each input has numeric inputmode", () => {
    render(<Subject label="Enter PIN" />);

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect(input.getAttribute("inputmode")).toBe("numeric");
    }
  });

  test("each input has maxlength of 1", () => {
    render(<Subject label="Enter PIN" />);

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect((input as HTMLInputElement).maxLength).toBe(1);
    }
  });

  test("each input has an accessible digit label", () => {
    render(<Subject label="Enter PIN" digitLabel={(n: number, of: number) => `Digit ${n} of ${of}`} />);

    expect(screen.getByLabelText("Digit 1 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Digit 2 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Digit 3 of 4")).toBeTruthy();
    expect(screen.getByLabelText("Digit 4 of 4")).toBeTruthy();
  });

  test("digit labels reflect custom length", () => {
    render(<Subject label="Enter Code" length={6} digitLabel={(n: number, of: number) => `Digit ${n} of ${of}`} />);

    expect(screen.getByLabelText("Digit 1 of 6")).toBeTruthy();
    expect(screen.getByLabelText("Digit 6 of 6")).toBeTruthy();
  });

  test("all inputs are disabled when disabled prop is true", () => {
    render(<Subject label="Enter PIN" disabled />);

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect((input as HTMLInputElement).disabled).toBe(true);
    }
  });

  test("all inputs are enabled by default", () => {
    render(<Subject label="Enter PIN" />);

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      expect((input as HTMLInputElement).disabled).toBe(false);
    }
  });

  test("passes through additional HTML attributes to the group", () => {
    render(<Subject label="Enter PIN" data-testid="pin-group" />);

    const group = screen.getByTestId("pin-group");
    expect(group).toBeTruthy();
  });

  test("passes through id attribute to the group", () => {
    render(<Subject label="Enter PIN" id="my-pin" />);

    const group = screen.getByRole("group");
    expect(group.getAttribute("id")).toBe("my-pin");
  });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(ui: React.ReactElement): HTMLFormElement {
  const { container } = render(<form>{ui}</form>);
  return container.querySelector("form")!;
}

const afterReset = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

describe("initial value and form reset", () => {
  test("the initial value fills the digit inputs", () => {
    const form = inForm(<Subject label="PIN" length={4} value="12" />);
    expect([...form.querySelectorAll<HTMLInputElement>("input")].map((input) => input.value)).toEqual(["1", "2", "", ""]);
  });

  test("a form reset restores the initial digits and reports them", async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [pin, setPin] = useState("1");
      return (
        <Subject
          label="PIN"
          length={2}
          value={pin}
          onChange={(next: string) => {
            setPin(next);
            onChange(next);
          }}
        />
      );
    }
    const form = inForm(<Controlled />);
    const inputs = form.querySelectorAll<HTMLInputElement>("input");
    fireEvent.input(inputs[1], { target: { value: "7" } });
    expect(onChange).toHaveBeenLastCalledWith("17");
    form.reset();
    await afterReset();
    expect([...inputs].map((input) => input.value)).toEqual(["1", ""]);
    expect(onChange).toHaveBeenLastCalledWith("1");
  });
});

describe("no English default", () => {
  test("without digitLabel each input is named by the group's own label", () => {
    render(<Subject label="Código" length={2} />);
    expect(screen.getAllByLabelText("Código").filter((el) => el.tagName === "INPUT")).toHaveLength(2);
    expect(screen.queryByLabelText(/Digit/)).toBeNull();
  });
});
