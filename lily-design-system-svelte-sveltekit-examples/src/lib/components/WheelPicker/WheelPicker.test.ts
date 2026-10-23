import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import WheelPicker from "./WheelPicker.svelte";

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April", disabled: true },
    { value: "5", label: "May" },
];
const make = (props: Record<string, unknown> = {}) => render(WheelPicker, { props: { label: "Month", options: months, value: "2", ...props } });
const list = () => screen.getByRole("listbox");
const selected = () => document.querySelector('[role="option"][aria-selected="true"]')?.textContent;

describe("WheelPicker", () => {
    it("renders a div with the base class first, then the consumer class, and a vertical listbox inside", () => {
        const { container } = make({ class: "mine" });
        expect(container.querySelector("div.wheel-picker")!.getAttribute("class")).toBe("wheel-picker mine");
        expect(list().getAttribute("aria-orientation")).toBe("vertical");
        expect(list().getAttribute("aria-label")).toBe("Month");
        expect(list().className).toBe("wheel-picker-list");
    });

    it("renders one option per entry and marks only the selected one", () => {
        make();
        expect(screen.getAllByRole("option")).toHaveLength(5);
        expect(selected()).toBe("February");
        expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
    });

    it("points aria-activedescendant at the selected option and keeps focus on the list", () => {
        make();
        const id = list().getAttribute("aria-activedescendant")!;
        expect(document.getElementById(id)!.textContent).toBe("February");
        expect(list().getAttribute("tabindex")).toBe("0");
    });

    it("selects nothing, and has no activedescendant, for an unknown value", () => {
        make({ value: "" });
        expect(selected()).toBeUndefined();
        expect(list().hasAttribute("aria-activedescendant")).toBe(false);
    });

    it("ArrowDown selects the next enabled option, skipping a disabled one, and calls onChange once", async () => {
        const onChange = vi.fn();
        make({ value: "3", onChange });
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(selected()).toBe("May");
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith("5");
    });

    it("ArrowUp, Home and End move the selection", async () => {
        make();
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(selected()).toBe("January");
        await fireEvent.keyDown(list(), { key: "End" });
        expect(selected()).toBe("May");
        await fireEvent.keyDown(list(), { key: "Home" });
        expect(selected()).toBe("January");
    });

    it("stops at the ends unless loop is set", async () => {
        const first = make({ value: "1" });
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(selected()).toBe("January");
        first.unmount();
        make({ value: "1", loop: true });
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(selected()).toBe("May");
    });

    it("PageDown moves by pageSize", async () => {
        make({ value: "1", pageSize: 2 });
        await fireEvent.keyDown(list(), { key: "PageDown" });
        expect(selected()).toBe("March");
    });

    it("type-ahead selects the option starting with the typed letter", async () => {
        make({ value: "1" });
        await fireEvent.keyDown(list(), { key: "m" });
        expect(selected()).toBe("March");
    });

    it("prevents the page scroll for the keys it handles", async () => {
        make();
        const notPrevented = await fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(notPrevented).toBe(false);
    });

    it("clicking an enabled option selects it and a disabled one does nothing", async () => {
        const onChange = vi.fn();
        make({ onChange });
        await fireEvent.click(screen.getByText("May"));
        expect(selected()).toBe("May");
        await fireEvent.click(screen.getByText("April"));
        expect(selected()).toBe("May");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("selecting the value already held is a no-op (no onChange)", async () => {
        const onChange = vi.fn();
        make({ value: "5", onChange });
        await fireEvent.keyDown(list(), { key: "End" });
        await fireEvent.click(screen.getByText("May"));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("marks disabled options with aria-disabled", () => {
        make();
        expect(screen.getByText("April").getAttribute("aria-disabled")).toBe("true");
        expect(screen.getByText("March").hasAttribute("aria-disabled")).toBe(false);
    });

    it("when disabled: not focusable, ignores keys and clicks", async () => {
        const onChange = vi.fn();
        make({ disabled: true, onChange });
        expect(list().getAttribute("tabindex")).toBe("-1");
        expect(list().getAttribute("aria-disabled")).toBe("true");
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        await fireEvent.click(screen.getByText("May"));
        expect(selected()).toBe("February");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("renders a hidden input only when a name is given, carrying the value", () => {
        const { container, unmount } = make();
        expect(container.querySelector("input")).toBeNull();
        unmount();
        const named = make({ name: "month" });
        const input = named.container.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(input.name).toBe("month");
        expect(input.value).toBe("2");
    });

    it("passes rest props to the root", () => {
        const { container } = make({ "data-testid": "wp", id: "x" });
        const root = container.querySelector("div.wheel-picker")!;
        expect(root.getAttribute("data-testid")).toBe("wp");
        expect(root.id).toBe("x");
    });
});
