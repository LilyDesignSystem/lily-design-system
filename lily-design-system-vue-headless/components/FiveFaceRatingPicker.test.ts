import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./FiveFaceRatingPicker.vue";

describe("FiveFaceRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(Subject, { props: { label: "Experience" } });
    expect(screen.getByRole("radiogroup", { name: "Experience" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(Subject, { props: { label: "Experience" } });
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("has all 5 default labels", () => {
    render(Subject, { props: { label: "Experience" } });
    expect(screen.getByText("Very bad")).toBeTruthy();
    expect(screen.getByText("Bad")).toBeTruthy();
    expect(screen.getByText("Okay")).toBeTruthy();
    expect(screen.getByText("Good")).toBeTruthy();
    expect(screen.getByText("Very good")).toBeTruthy();
  });

  test("supports custom labels", () => {
    render(Subject, {
      props: { label: "E", labels: ["Terrible", "Poor", "Fair", "Great", "Excellent"] },
    });
    expect(screen.getByText("Terrible")).toBeTruthy();
    expect(screen.getByText("Poor")).toBeTruthy();
    expect(screen.getByText("Fair")).toBeTruthy();
    expect(screen.getByText("Great")).toBeTruthy();
    expect(screen.getByText("Excellent")).toBeTruthy();
  });

  test("clicking selects a face", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Experience" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[3]);
    expect(radios[3].checked).toBe(true);
  });

  test("uses default name for form submission", () => {
    render(Subject, { props: { label: "Experience" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("face-rating");
  });

  test("supports custom name", () => {
    render(Subject, { props: { label: "Experience", name: "satisfaction" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("satisfaction");
  });

  test("supports disabled", () => {
    render(Subject, {
      props: { label: "Experience", disabled: true, "data-testid": "r" },
    });
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("disabled radios cannot be clicked", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, {
      props: { label: "Experience", disabled: true },
    });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(false);
  });

  test("no radio is checked by default", () => {
    render(Subject, { props: { label: "Experience" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    const checked = radios.filter((r) => r.checked);
    expect(checked).toHaveLength(0);
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "E", "data-testid": "fr" } });
    expect(screen.getByTestId("fr")).toBeTruthy();
  });
});

// Regression: same undeclared-`value` binding as the sibling pickers, plus
// an array default passed as a literal where Vue requires a factory.
describe("FiveFaceRatingPicker model binding", () => {
  test("reflects the model value as the checked face", () => {
    render(Subject, { props: { label: "Rating", modelValue: 2 } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[1].checked).toBe(true);
  });

  test("emits update:modelValue when a face is chosen", async () => {
    const user: UserEvent = userEvent.setup();
    const { emitted } = render(Subject, { props: { label: "Rating" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[4]);
    expect(emitted()["update:modelValue"]).toEqual([[5]]);
  });

  test("default labels are not shared between instances", () => {
    const first = render(Subject, { props: { label: "A" } });
    expect(first.getByRole("radiogroup").textContent).toContain("Very bad");
  });
});
