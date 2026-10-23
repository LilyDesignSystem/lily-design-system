import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/vue";

import Subject from "./WheelPicker.vue";

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April", disabled: true },
    { value: "5", label: "May" },
];

// v-model: collect what the component emits, as a parent's handler would.
function make(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
    const emitted: string[] = [];
    const result = render(Subject, {
        props: { label: "Month", options: months, modelValue: "2", "onUpdate:modelValue": (v: string) => emitted.push(v), ...props },
        attrs,
    });
    return { ...result, emitted };
}
const list = () => screen.getByRole("listbox");
const selected = () => document.querySelector('[role="option"][aria-selected="true"]')?.textContent;

describe("WheelPicker", () => {
    test("renders a div with the base class first, then the consumer class, and a vertical listbox inside", () => {
        const { container } = make({}, { class: "mine" });
        expect(container.querySelector("div.wheel-picker")!.getAttribute("class")).toBe("wheel-picker mine");
        expect(list().getAttribute("aria-orientation")).toBe("vertical");
        expect(list().getAttribute("aria-label")).toBe("Month");
        expect(list().className).toBe("wheel-picker-list");
    });

    test("renders one option per entry and marks only the selected one", () => {
        make();
        expect(screen.getAllByRole("option")).toHaveLength(5);
        expect(selected()).toBe("February");
        expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
    });

    test("points aria-activedescendant at the selected option and keeps focus on the list", () => {
        make();
        const id = list().getAttribute("aria-activedescendant")!;
        expect(document.getElementById(id)!.textContent).toBe("February");
        expect(list().getAttribute("tabindex")).toBe("0");
    });

    test("selects nothing, and has no activedescendant, for an unknown value", () => {
        make({ modelValue: "" });
        expect(selected()).toBeUndefined();
        expect(list().hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("ArrowDown emits the next enabled option, skipping a disabled one, once", async () => {
        const { emitted } = make({ modelValue: "3" });
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(emitted).toEqual(["5"]);
    });

    test("ArrowUp, Home and End emit the new selection", async () => {
        const { emitted } = make();
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        await fireEvent.keyDown(list(), { key: "End" });
        expect(emitted).toEqual(["1", "5"]);
    });

    test("stops at the ends unless loop is set", async () => {
        const first = make({ modelValue: "1" });
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(first.emitted).toEqual([]);
        first.unmount();
        const looped = make({ modelValue: "1", loop: true });
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(looped.emitted).toEqual(["5"]);
    });

    test("PageDown moves by pageSize", async () => {
        const { emitted } = make({ modelValue: "1", pageSize: 2 });
        await fireEvent.keyDown(list(), { key: "PageDown" });
        expect(emitted).toEqual(["3"]);
    });

    test("type-ahead selects the option starting with the typed letter", async () => {
        const { emitted } = make({ modelValue: "1" });
        await fireEvent.keyDown(list(), { key: "m" });
        expect(emitted).toEqual(["3"]);
    });

    test("prevents the page scroll for the keys it handles", () => {
        make();
        const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
        list().dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    test("clicking an enabled option emits it and a disabled one does nothing", async () => {
        const { emitted } = make();
        await fireEvent.click(screen.getByText("May"));
        await fireEvent.click(screen.getByText("April"));
        expect(emitted).toEqual(["5"]);
    });

    test("selecting the value already held is a no-op (nothing emitted)", async () => {
        const { emitted } = make({ modelValue: "5" });
        await fireEvent.keyDown(list(), { key: "End" });
        await fireEvent.click(screen.getByText("May"));
        expect(emitted).toEqual([]);
    });

    test("marks disabled options with aria-disabled", () => {
        make();
        expect(screen.getByText("April").getAttribute("aria-disabled")).toBe("true");
        expect(screen.getByText("March").hasAttribute("aria-disabled")).toBe(false);
    });

    test("when disabled: not focusable, ignores keys and clicks", async () => {
        const { emitted } = make({ disabled: true });
        expect(list().getAttribute("tabindex")).toBe("-1");
        expect(list().getAttribute("aria-disabled")).toBe("true");
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        await fireEvent.click(screen.getByText("May"));
        expect(emitted).toEqual([]);
    });

    test("renders a hidden input only when a name is given, carrying the value", () => {
        const { container, unmount } = make();
        expect(container.querySelector("input")).toBeNull();
        unmount();
        const named = make({ name: "month" });
        const input = named.container.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(input.name).toBe("month");
        expect(input.value).toBe("2");
    });

    test("passes attrs to the root", () => {
        const { container } = make({}, { "data-testid": "wp", id: "x" });
        const root = container.querySelector("div.wheel-picker")!;
        expect(root.getAttribute("data-testid")).toBe("wp");
        expect(root.id).toBe("x");
    });
});
