import { fireEvent, render, screen } from "@testing-library/vue";
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

  test("renders each star's number alongside its unit, from starLabel", () => {
    render(Subject, { props: { label: "Rating", starLabel: (n: number) => `${n} star` } });
    const group = screen.getByRole("radiogroup");
    expect(group.textContent).toContain("1 star");
    expect(group.textContent).not.toContain(':star="star"');
  });
});

/** Render inside a real <form>, so form.reset() reaches the component. */
function inForm(props: Record<string, unknown>) {
  const form = document.createElement("form");
  document.body.appendChild(form);
  const result = render(Subject, { props, container: form });
  return { form, emitted: result.emitted };
}

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("form reset", () => {
  test("a form reset restores the initial value and emits it", async () => {
    const { form, emitted } = inForm({ label: "Rating", name: "rating", modelValue: 3 });
    await fireEvent.click(form.querySelector<HTMLInputElement>('input[value="5"]')!);
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual([5]);
    form.reset();
    await afterReset();
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual([3]);
    expect(form.querySelector<HTMLInputElement>("input:checked")?.value).toBe("3");
    expect(new FormData(form).get("rating")).toBe("3");
  });

  test("a cancelled reset changes nothing", async () => {
    const { form, emitted } = inForm({ label: "Rating", name: "rating", modelValue: 3 });
    await fireEvent.click(form.querySelector<HTMLInputElement>('input[value="5"]')!);
    form.addEventListener("reset", (event) => event.preventDefault());
    form.reset();
    await afterReset();
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual([5]);
  });
});

describe("no English default", () => {
  test("without starLabel the options are the numbers alone", () => {
    render(Subject, { props: { label: "Rating" } });
    expect(screen.getByLabelText("3")).toBeTruthy();
    expect(screen.queryByText(/stars?/)).toBeNull();
  });

  test("starLabel supplies each option's text", () => {
    render(Subject, { props: { label: "Rating", starLabel: (n: number) => (n === 1 ? "1 étoile" : `${n} étoiles`) } });
    expect(screen.getByLabelText("1 étoile")).toBeTruthy();
    expect(screen.getByLabelText("4 étoiles")).toBeTruthy();
  });
});
