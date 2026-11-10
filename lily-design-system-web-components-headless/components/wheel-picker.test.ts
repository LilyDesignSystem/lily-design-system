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
const selected = (h: HTMLElement) =>
    h.querySelector('[role="option"][aria-selected="true"]')?.textContent;
const key = (h: HTMLElement, k: string): KeyboardEvent => {
    const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
    list(h).dispatchEvent(event);
    return event;
};
const click = (h: HTMLElement, text: string): void => {
    (
        Array.from(h.querySelectorAll<HTMLElement>('[role="option"]')).find(
            (o) => o.textContent === text,
        ) as HTMLElement
    ).click();
};

describe("WheelPicker", () => {
    test("renders a div with the base class first, then the host's class, and a vertical listbox inside", () => {
        const host = render('label="Month" value="2" class="mine"');
        expect(host.querySelector("div.wheel-picker")!.getAttribute("class")).toBe(
            "wheel-picker mine",
        );
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
        host.options = [
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
        ];
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

    test("a disabled element's hidden input is disabled, so it is not submitted", () => {
        document.body.innerHTML = `<form><lily-wheel-picker label="Month" value="2" name="month" disabled>${OPTIONS}</lily-wheel-picker></form>`;
        const form = document.querySelector("form")!;
        expect(form.querySelector<HTMLInputElement>("input[type=hidden]")!.disabled).toBe(true);
        expect(new FormData(form).has("month")).toBe(false);
    });

    test("passes form to the hidden input, and not to the root", () => {
        const h = render('label="Month" value="2" name="month" form="elsewhere"');
        expect(h.querySelector("input[type=hidden]")!.getAttribute("form")).toBe("elsewhere");
        expect(h.querySelector(".wheel-picker")!.hasAttribute("form")).toBe(false);
    });

    test("form reset puts the element back to its first value and fires change", async () => {
        document.body.innerHTML = `<form><lily-wheel-picker label="Month" value="2" name="month">${OPTIONS}</lily-wheel-picker></form>`;
        const h = document.querySelector("lily-wheel-picker") as WheelPicker;
        key(h, "ArrowDown");
        expect(h.value).toBe("3");
        const onChange = vi.fn();
        h.addEventListener("change", onChange);
        document.querySelector("form")!.reset();
        await new Promise((resolve) => setTimeout(resolve, 5));
        expect(h.value).toBe("2");
        expect(selected(h)).toBe("February");
        expect(h.querySelector<HTMLInputElement>("input[type=hidden]")!.value).toBe("2");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("horizontal: aria-orientation, ArrowRight and ArrowLeft move, ArrowDown does not", () => {
        const h = render('label="Month" value="2" orientation="horizontal"');
        expect(list(h).getAttribute("aria-orientation")).toBe("horizontal");
        key(h, "ArrowRight");
        expect(selected(h)).toBe("March");
        key(h, "ArrowLeft");
        expect(selected(h)).toBe("February");
        key(h, "ArrowDown");
        expect(selected(h)).toBe("February");
    });

    test("horizontal, right-to-left: the arrows swap", () => {
        document.body.innerHTML = `<div dir="rtl"><lily-wheel-picker label="Month" value="2" orientation="horizontal">${OPTIONS}</lily-wheel-picker></div>`;
        const h = document.querySelector("lily-wheel-picker") as WheelPicker;
        key(h, "ArrowLeft");
        expect(selected(h)).toBe("March");
        key(h, "ArrowRight");
        expect(selected(h)).toBe("February");
    });

    // jsdom lays nothing out, so each option's box is set by hand: 40px rows, the list's middle at 100.
    function layOut(h: HTMLElement, scrolledBy: number) {
        list(h).getBoundingClientRect = () =>
            ({ top: 0, height: 200, left: 0, width: 100 }) as DOMRect;
        h.querySelectorAll<HTMLElement>('[role="option"]').forEach((option, index) => {
            option.getBoundingClientRect = () =>
                ({ top: index * 40 - scrolledBy, height: 40, left: 0, width: 100 }) as DOMRect;
        });
    }

    test("scrolling chooses the option the wheel settles on, and fires change once", () => {
        const h = render();
        const onChange = vi.fn();
        h.addEventListener("change", onChange);
        layOut(h, 0); // the middles are 20, 60, 100, 140, 180: March is at the list's middle
        list(h).dispatchEvent(new Event("wheel"));
        list(h).dispatchEvent(new Event("scroll"));
        list(h).dispatchEvent(new Event("scrollend"));
        expect(h.value).toBe("3");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("a scroll with no gesture before it chooses nothing", () => {
        const h = render();
        layOut(h, 0);
        list(h).dispatchEvent(new Event("scroll"));
        list(h).dispatchEvent(new Event("scrollend"));
        expect(h.value).toBe("2");
    });

    test("scrolling skips a disabled option, and settles without scrollend too", async () => {
        const h = render();
        layOut(h, 30); // the middles are -10, 30, 70, 110, 150: April (disabled) is nearest, then March
        list(h).dispatchEvent(new Event("wheel"));
        list(h).dispatchEvent(new Event("scroll"));
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(h.value).toBe("3");
    });
});
