import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TagInputDiv.vue";

const field = (label: string) => screen.getByRole("textbox", { name: label }) as HTMLInputElement;

describe("TagInputDiv", () => {
    test("the root is a named group with the base class", () => {
        render(Subject, { props: { label: "Add tag" }, attrs: { class: "extra" } });
        const root = screen.getByRole("group", { name: "Add tag" });
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("tag-input-div")).toBe(true);
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds a named text field", () => {
        render(Subject, { props: { label: "New tag" } });
        expect(field("New tag").type).toBe("text");
        expect(field("New tag").classList.contains("tag-input-div-field")).toBe(true);
    });

    test("the field takes disabled, placeholder, name and required", () => {
        render(Subject, {
            props: { label: "T", disabled: true, placeholder: "P", name: "n", required: true },
        });
        const input = field("T");
        expect(input.disabled).toBe(true);
        expect(input.placeholder).toBe("P");
        expect(input.name).toBe("n");
        expect(input.required).toBe(true);
    });

    test("passes other attributes to the root", () => {
        render(Subject, { props: { label: "T" }, attrs: { "data-testid": "ti" } });
        expect(screen.getByTestId("ti").tagName).toBe("DIV");
    });

    test("renders the consumer's tags before the field", () => {
        render(Subject, {
            props: { label: "T" },
            slots: { default: '<span data-testid="tag">one</span>' },
        });
        expect(screen.getByTestId("tag").nextElementSibling).toBe(field("T"));
    });

    test("Enter during an IME composition adds nothing", async () => {
        const { emitted } = render(Subject, { props: { label: "T", modelValue: "one" } });
        await fireEvent.keyDown(field("T"), { key: "Enter", isComposing: true });
        expect(emitted().add).toBeUndefined();
    });
});

// Regression: the Enter handler called `onadd?.()`, an identifier the
// component never declared, so submitting a tag threw a ReferenceError.
// React's TagInputDiv exposes this as an `onAdd` callback; Vue's idiom is an
// emit, so the contract is now an `add` event.
describe("TagInputDiv add event", () => {
    test("emits add with the trimmed value on Enter", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Add tag", modelValue: "  vue  " },
        });
        const input = field("Add tag");
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(emitted().add).toEqual([["vue"]]);
    });

    test("clears the model after adding", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Add tag", modelValue: "vue" },
        });
        await fireEvent.keyDown(field("Add tag"), { key: "Enter" });
        expect(emitted()["update:modelValue"]).toEqual([[""]]);
    });

    test("does not emit add for a blank value", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Add tag", modelValue: "   " },
        });
        await fireEvent.keyDown(field("Add tag"), { key: "Enter" });
        expect(emitted().add).toBeUndefined();
    });
});
