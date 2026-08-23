import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./FiveStarRatingPicker.vue";

describe("FiveStarRatingPicker", () => {
  test("renders as a radiogroup", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeTruthy();
  });

  test("has 5 radio buttons", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  test("clicking a star selects it", async () => {
    const user: UserEvent = userEvent.setup();
    render(Subject, { props: { label: "Rating" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[2]);
    expect(radios[2].checked).toBe(true);
  });

  test("supports disabled", () => {
    render(Subject, {
      props: { label: "Rating", disabled: true, "data-testid": "r" },
    });
    expect((screen.getByTestId("r") as HTMLFieldSetElement).disabled).toBe(
      true,
    );
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "Rating", "data-testid": "r" } });
    expect(screen.getByTestId("r")).toBeTruthy();
  });
});

// Regression: the template bound `value`, a name the component never
// declared, so the control rendered unchecked no matter what the model
// held and choosing a star updated nothing. The pre-existing "clicking a
// star selects it" test passed anyway, because a native radio checks
// itself on click regardless of what Vue bound to it.
describe("FiveStarRatingPicker model binding", () => {
  test("reflects the model value as the checked star", () => {
    render(Subject, { props: { label: "Rating", modelValue: 3 } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[2].checked).toBe(true);
  });

  test("emits update:modelValue when a star is chosen", async () => {
    const user: UserEvent = userEvent.setup();
    const { emitted } = render(Subject, { props: { label: "Rating" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await user.click(radios[3]);
    expect(emitted()["update:modelValue"]).toEqual([[4]]);
  });

  test("renders each star's number alongside its unit", () => {
    render(Subject, { props: { label: "Rating" } });
    const group = screen.getByRole("radiogroup");
    expect(group.textContent).toContain("1");
    expect(group.textContent).toContain("star");
    expect(group.textContent).not.toContain(':star="star"');
  });
});
