import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TagInput.vue";

describe("TagInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Add tag" } });
        expect((screen.getByLabelText("Add tag") as HTMLInputElement).type).toBe("text");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "New tag" } });
        expect(screen.getByLabelText("New tag")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Add tag", disabled: true } });
        expect((screen.getByLabelText("Add tag") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "ti" } });
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});

// Regression: the Enter handler called `onadd?.()`, an identifier the
// component never declared, so submitting a tag threw a ReferenceError.
// React's TagInput exposes this as an `onAdd` callback; Vue's idiom is an
// emit, so the contract is now an `add` event.
describe("TagInput add event", () => {
  test("emits add with the trimmed value on Enter", async () => {
    const { emitted } = render(Subject, {
      props: { label: "Add tag", modelValue: "  vue  " },
    });
    const input = screen.getByLabelText("Add tag");
    await fireEvent.keyDown(input, { key: "Enter" });
    expect(emitted().add).toEqual([["vue"]]);
  });

  test("clears the model after adding", async () => {
    const { emitted } = render(Subject, {
      props: { label: "Add tag", modelValue: "vue" },
    });
    await fireEvent.keyDown(screen.getByLabelText("Add tag"), { key: "Enter" });
    expect(emitted()["update:modelValue"]).toEqual([[""]]);
  });

  test("does not emit add for a blank value", async () => {
    const { emitted } = render(Subject, {
      props: { label: "Add tag", modelValue: "   " },
    });
    await fireEvent.keyDown(screen.getByLabelText("Add tag"), { key: "Enter" });
    expect(emitted().add).toBeUndefined();
  });
});
