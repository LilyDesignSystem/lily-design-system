import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import type React from "react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./NetPromoterScorePicker";

describe("NetPromoterScorePicker", () => {
  test("renders a radiogroup", () => {
    render(<Subject label="NPS Rating" />);

    const group = screen.getByRole("radiogroup");
    expect(group).toBeTruthy();
  });

  test("has aria-label from label prop", () => {
    render(<Subject label="NPS Rating" />);

    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("aria-label")).toBe("NPS Rating");
  });

  test("renders 11 radio buttons (0-10)", () => {
    render(<Subject label="NPS Rating" />);

    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBe(11);
  });

  test("each radio has aria-label with its number", () => {
    render(<Subject label="NPS Rating" />);

    const radios = screen.getAllByRole("radio");
    for (let i = 0; i <= 10; i++) {
      expect(radios[i].getAttribute("aria-label")).toBe(String(i));
    }
  });

  test("radio values range from 0 to 10", () => {
    render(<Subject label="NPS Rating" />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    for (let i = 0; i <= 10; i++) {
      expect(radios[i].value).toBe(String(i));
    }
  });

  test("renders as a fieldset element", () => {
    render(<Subject label="NPS Rating" />);

    const group = screen.getByRole("radiogroup");
    expect(group.tagName).toBe("FIELDSET");
  });

  test("passes through additional HTML attributes", () => {
    render(<Subject label="NPS" data-testid="nps-input" />);

    expect(screen.getByTestId("nps-input")).toBeTruthy();
  });

  test("default name attribute is nps", () => {
    render(<Subject label="NPS Rating" />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("nps");
  });

  test("accepts custom name attribute", () => {
    render(<Subject label="NPS Rating" name="score" />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("score");
  });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(ui: React.ReactElement): HTMLFormElement {
  const { container } = render(<form>{ui}</form>);
  return container.querySelector("form")!;
}

const afterReset = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

/** A consumer that controls the value, as this component expects. */
function Controlled({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState("7");
  return (
    <Subject
      label="Rating"
      name="nps"
      value={value}
      onChange={(next: string) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe("form reset", () => {
  test("a form reset restores the initial value and reports it to the consumer", async () => {
    const onChange = vi.fn();
    const form = inForm(<Controlled onChange={onChange} />);
    fireEvent.click(form.querySelector<HTMLInputElement>('input[value="9"]')!);
    expect(onChange).toHaveBeenLastCalledWith("9");
    form.reset();
    await afterReset();
    expect(onChange).toHaveBeenLastCalledWith("7");
    expect(form.querySelector<HTMLInputElement>("input:checked")?.value).toBe("7");
    expect(new FormData(form).get("nps")).toBe("7");
  });

  test("a cancelled reset changes nothing", async () => {
    const onChange = vi.fn();
    const form = inForm(<Controlled onChange={onChange} />);
    fireEvent.click(form.querySelector<HTMLInputElement>('input[value="9"]')!);
    form.addEventListener("reset", (event) => event.preventDefault());
    form.reset();
    await afterReset();
    expect(onChange).toHaveBeenLastCalledWith("9");
    expect(new FormData(form).get("nps")).toBe("9");
  });
});
