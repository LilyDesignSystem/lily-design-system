import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./WheelPicker";

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April", disabled: true },
    { value: "5", label: "May" },
];

// The component is controlled: a small host holds the value, as a consumer would.
function Host({ initial = "2", onChange, ...rest }: { initial?: string; onChange?: (v: string) => void; [key: string]: unknown }) {
    const [value, setValue] = useState(initial);
    return (
        <Subject
            label="Month"
            options={months}
            value={value}
            onChange={(v) => {
                setValue(v);
                onChange?.(v);
            }}
            {...rest}
        />
    );
}
const list = () => screen.getByRole("listbox");
const selected = () => document.querySelector('[role="option"][aria-selected="true"]')?.textContent;

describe("WheelPicker", () => {
    test("renders a div with the base class first, then the consumer class, and a vertical listbox inside", () => {
        const { container } = render(<Host className="mine" />);
        expect(container.querySelector("div.wheel-picker")!.getAttribute("class")).toBe("wheel-picker mine");
        expect(list().getAttribute("aria-orientation")).toBe("vertical");
        expect(list().getAttribute("aria-label")).toBe("Month");
        expect(list().className).toBe("wheel-picker-list");
    });

    test("renders one option per entry and marks only the selected one", () => {
        render(<Host />);
        expect(screen.getAllByRole("option")).toHaveLength(5);
        expect(selected()).toBe("February");
        expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
    });

    test("points aria-activedescendant at the selected option and keeps focus on the list", () => {
        render(<Host />);
        const id = list().getAttribute("aria-activedescendant")!;
        expect(document.getElementById(id)!.textContent).toBe("February");
        expect(list().getAttribute("tabindex")).toBe("0");
    });

    test("selects nothing, and has no activedescendant, for an unknown value", () => {
        render(<Host initial="" />);
        expect(selected()).toBeUndefined();
        expect(list().hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("ArrowDown selects the next enabled option, skipping a disabled one, and calls onChange once", () => {
        const onChange = vi.fn();
        render(<Host initial="3" onChange={onChange} />);
        fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(selected()).toBe("May");
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith("5");
    });

    test("ArrowUp, Home and End move the selection", () => {
        render(<Host />);
        fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(selected()).toBe("January");
        fireEvent.keyDown(list(), { key: "End" });
        expect(selected()).toBe("May");
        fireEvent.keyDown(list(), { key: "Home" });
        expect(selected()).toBe("January");
    });

    test("stops at the ends unless loop is set", () => {
        const first = render(<Host initial="1" />);
        fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(selected()).toBe("January");
        first.unmount();
        render(<Host initial="1" loop />);
        fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(selected()).toBe("May");
    });

    test("PageDown moves by pageSize", () => {
        render(<Host initial="1" pageSize={2} />);
        fireEvent.keyDown(list(), { key: "PageDown" });
        expect(selected()).toBe("March");
    });

    test("type-ahead selects the option starting with the typed letter", () => {
        render(<Host initial="1" />);
        fireEvent.keyDown(list(), { key: "m" });
        expect(selected()).toBe("March");
    });

    test("prevents the page scroll for the keys it handles", () => {
        render(<Host />);
        expect(fireEvent.keyDown(list(), { key: "ArrowDown" })).toBe(false);
    });

    test("clicking an enabled option selects it and a disabled one does nothing", () => {
        const onChange = vi.fn();
        render(<Host onChange={onChange} />);
        fireEvent.click(screen.getByText("May"));
        expect(selected()).toBe("May");
        fireEvent.click(screen.getByText("April"));
        expect(selected()).toBe("May");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("selecting the value already held is a no-op (no onChange)", () => {
        const onChange = vi.fn();
        render(<Host initial="5" onChange={onChange} />);
        fireEvent.keyDown(list(), { key: "End" });
        fireEvent.click(screen.getByText("May"));
        expect(onChange).not.toHaveBeenCalled();
    });

    test("marks disabled options with aria-disabled", () => {
        render(<Host />);
        expect(screen.getByText("April").getAttribute("aria-disabled")).toBe("true");
        expect(screen.getByText("March").hasAttribute("aria-disabled")).toBe(false);
    });

    test("when disabled: not focusable, ignores keys and clicks", () => {
        const onChange = vi.fn();
        render(<Host disabled onChange={onChange} />);
        expect(list().getAttribute("tabindex")).toBe("-1");
        expect(list().getAttribute("aria-disabled")).toBe("true");
        fireEvent.keyDown(list(), { key: "ArrowDown" });
        fireEvent.click(screen.getByText("May"));
        expect(selected()).toBe("February");
        expect(onChange).not.toHaveBeenCalled();
    });

    test("renders a hidden input only when a name is given, carrying the value", () => {
        const { container, unmount } = render(<Host />);
        expect(container.querySelector("input")).toBeNull();
        unmount();
        const named = render(<Host name="month" />);
        const input = named.container.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(input.name).toBe("month");
        expect(input.value).toBe("2");
    });

    test("passes rest props to the root", () => {
        const { container } = render(<Host data-testid="wp" id="x" />);
        const root = container.querySelector("div.wheel-picker")!;
        expect(root.getAttribute("data-testid")).toBe("wp");
        expect(root.id).toBe("x");
    });
});
