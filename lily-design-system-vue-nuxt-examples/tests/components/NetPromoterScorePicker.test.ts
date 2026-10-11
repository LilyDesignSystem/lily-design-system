import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/NetPromoterScorePicker.vue";

describe("NetPromoterScorePicker", () => {
  test("renders a radiogroup", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const group = screen.getByRole("radiogroup");
    expect(group).toBeTruthy();
  });

  test("has aria-label from label prop", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("aria-label")).toBe("NPS Rating");
  });

  test("renders 11 radio buttons (0-10)", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBe(11);
  });

  test("each radio has aria-label with its number", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio");
    for (let i = 0; i <= 10; i++) {
      expect(radios[i].getAttribute("aria-label")).toBe(String(i));
    }
  });

  test("radio values range from 0 to 10", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    for (let i = 0; i <= 10; i++) {
      expect(radios[i].value).toBe(String(i));
    }
  });

  test("renders as a fieldset element", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const group = screen.getByRole("radiogroup");
    expect(group.tagName).toBe("FIELDSET");
  });

  test("passes through additional HTML attributes", () => {
    render(Subject, { props: { label: "NPS", "data-testid": "nps-input" } });

    expect(screen.getByTestId("nps-input")).toBeTruthy();
  });

  test("default name attribute is nps", () => {
    render(Subject, { props: { label: "NPS Rating" } });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("nps");
  });

  test("accepts custom name attribute", () => {
    render(Subject, { props: { label: "NPS Rating", name: "score" } });

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].name).toBe("score");
  });
});

// Regression: the template bound `value` (never declared) and wrapped the
// change handler in `{{ }}` interpolation inside a directive value, so no
// score was ever recorded. The pre-existing tests only checked markup.
describe("NetPromoterScorePicker model binding", () => {
  test("reflects the model value as the checked score", () => {
    render(Subject, { props: { label: "NPS", modelValue: "7" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[7].checked).toBe(true);
  });

  test("emits update:modelValue when a score is chosen", async () => {
    const { emitted } = render(Subject, { props: { label: "NPS" } });
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    await fireEvent.update(radios[9]);
    expect(emitted()["update:modelValue"]).toEqual([["9"]]);
  });

  test("renders each score's number as text", () => {
    render(Subject, { props: { label: "NPS" } });
    const group = screen.getByRole("radiogroup");
    expect(group.textContent).not.toContain(':score="score"');
    expect(group.textContent).toContain("10");
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
    const { form, emitted } = inForm({ label: "Rating", name: "nps", modelValue: "7" });
    await fireEvent.click(form.querySelector<HTMLInputElement>('input[value="9"]')!);
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual(["9"]);
    form.reset();
    await afterReset();
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual(["7"]);
    expect(form.querySelector<HTMLInputElement>("input:checked")?.value).toBe("7");
    expect(new FormData(form).get("nps")).toBe("7");
  });

  test("a cancelled reset changes nothing", async () => {
    const { form, emitted } = inForm({ label: "Rating", name: "nps", modelValue: "7" });
    await fireEvent.click(form.querySelector<HTMLInputElement>('input[value="9"]')!);
    form.addEventListener("reset", (event) => event.preventDefault());
    form.reset();
    await afterReset();
    expect(emitted()["update:modelValue"]?.at(-1)).toEqual(["9"]);
  });
});
