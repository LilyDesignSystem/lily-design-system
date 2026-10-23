import { afterEach, describe, expect, test, vi } from "vitest";

import { WheelPicker } from "./wheel-picker.js";

if (!customElements.get("lily-wheel-picker")) {
    customElements.define("lily-wheel-picker", WheelPicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const OPTIONS = `<option value="1">January</option><option value="2">February</option><option value="3">March</option><option value="4" disabled>April</option><option value="5">May</option>`;

function render(attrs = 'label="Month" value="2"', options = OPTIONS): WheelPicker {
    document.body.innerHTML = `<lily-wheel-picker ${attrs}>${options}</lily-wheel-picker>`;
    return document.body.firstElementChild as WheelPicker;
}
const list = (h: HTMLElement) => h.querySelector(".wheel-picker-list") as HTMLElement;
const selected = (h: HTMLElement) => h.querySelector('[role="option"][aria-selected="true"]')?.textContent;
const key = (h: HTMLElement, k: string): KeyboardEvent => {
    const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
    list(h).dispatchEvent(event);
    return event;
};
const click = (h: HTMLElement, text: string): void => {
    (Array.from(h.querySelectorAll<HTMLElement>('[role="option"]')).find((o) => o.textContent === text) as HTMLElement).click();
};

describe("WheelPicker", () => {
    test("renders a div with the base class first, then the host's class, and a vertical listbox inside", () => {
        const host = render('label="Month" value="2" class="mine"');
        expect(host.querySelector("div.wheel-picker")!.getAttribute("class")).toBe("wheel-picker mine");
        expect(list(host).getAttribute("role")).toBe("listbox");
        expect(list(host).getAttribute("aria-orientation")).toBe("vertical");
        expect(list(host).getAttribute("aria-label")).toBe("Month");
        expect(list(host).className).toBe("wheel-picker-list");
    });

    test("reads the child <option> elements and marks only the selected one", () => {
        const host = render();
        expect(host.querySelectorAll('[role="option"]')).toHaveLength(5);
        expect(selected(host)).toBe("February");
        expect(host.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
        expect(host.querySelector("option")).toBeNull();
    });

    test("points aria-activedescendant at the selected option and keeps focus on the list", () => {
        const host = render();
        const id = list(host).getAttribute("aria-activedescendant")!;
        expect(document.getElementById(id)!.textContent).toBe("February");
        expect(list(host).getAttribute("tabindex")).toBe("0");
    });

    test("selects nothing, and has no activedescendant, for an unknown value", () => {
        const host = render('label="Month"');
        expect(selected(host)).toBeUndefined();
        expect(list(host).hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("ArrowDown selects the next enabled option, skipping a disabled one, and fires change once", () => {
        const host = render('label="Month" value="3"');
        const onChange = vi.fn();
        host.addEventListener("change", onChange);
        key(host, "ArrowDown");
        expect(selected(host)).toBe("May");
        expect(host.value).toBe("5");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("ArrowUp, Home and End move the selection", () => {
        const host = render();
        key(host, "ArrowUp");
        expect(selected(host)).toBe("January");
        key(host, "End");
        expect(selected(host)).toBe("May");
        key(host, "Home");
        expect(selected(host)).toBe("January");
    });

    test("stops at the ends unless loop is set", () => {
        const first = render('label="Month" value="1"');
        key(first, "ArrowUp");
        expect(selected(first)).toBe("January");
        const looped = render('label="Month" value="1" loop');
        key(looped, "ArrowUp");
        expect(selected(looped)).toBe("May");
    });

    test("PageDown moves by page-size", () => {
        const host = render('label="Month" value="1" page-size="2"');
        key(host, "PageDown");
        expect(selected(host)).toBe("March");
    });

    test("type-ahead selects the option starting with the typed letter", () => {
        const host = render('label="Month" value="1"');
        key(host, "m");
        expect(selected(host)).toBe("March");
    });

    test("prevents the page scroll for the keys it handles", () => {
        expect(key(render(), "ArrowDown").defaultPrevented).toBe(true);
    });

    test("clicking an enabled option selects it and a disabled one does nothing", () => {
        const host = render();
        const onChange = vi.fn();
        host.addEventListener("change", onChange);
        click(host, "May");
        expect(selected(host)).toBe("May");
        click(host, "April");
        expect(selected(host)).toBe("May");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("selecting the value already held is a no-op (no change event)", () => {
        const host = render('label="Month" value="5"');
        const onChange = vi.fn();
        host.addEventListener("change", onChange);
        key(host, "End");
        click(host, "May");
        expect(onChange).not.toHaveBeenCalled();
    });

    test("marks disabled options with aria-disabled", () => {
        const host = render();
        expect(host.querySelector('[data-value="4"]')!.getAttribute("aria-disabled")).toBe("true");
        expect(host.querySelector('[data-value="3"]')!.hasAttribute("aria-disabled")).toBe(false);
    });

    test("when disabled: not focusable, ignores keys and clicks", () => {
        const host = render('label="Month" value="2" disabled');
        expect(list(host).getAttribute("tabindex")).toBe("-1");
        expect(list(host).getAttribute("aria-disabled")).toBe("true");
        key(host, "ArrowDown");
        click(host, "May");
        expect(selected(host)).toBe("February");
    });

    test("renders a hidden input only when a name is given, carrying the value", () => {
        expect(render().querySelector("input")).toBeNull();
        const host = render('label="Month" value="2" name="month"');
        const input = host.querySelector("input[type=hidden]") as HTMLInputElement;
        expect(input.name).toBe("month");
        expect(input.value).toBe("2");
    });

    test("the options property replaces the options", () => {
        const host = render();
        host.options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }];
        expect(host.querySelectorAll('[role="option"]')).toHaveLength(2);
        host.value = "b";
        expect(selected(host)).toBe("Beta");
    });

    test("passes other attributes to the root div", () => {
        const host = render('label="Month" value="2" data-testid="wp" id="x"');
        const root = host.querySelector("div.wheel-picker")!;
        expect(root.getAttribute("data-testid")).toBe("wp");
        expect(root.id).toBe("x");
    });
});
