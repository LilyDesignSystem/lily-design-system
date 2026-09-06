import { afterEach, describe, expect, test, vi } from "vitest";

import { ColorPicker } from "./color-picker.js";

if (!customElements.get("lily-color-picker")) {
    customElements.define("lily-color-picker", ColorPicker);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ColorPicker", () => {
    test("carries the base class and role=slider", () => {
        const host = render('<lily-color-picker label="Pick a color"></lily-color-picker>');

        expect(host.classList.contains("color-picker")).toBe(true);
        expect(host.getAttribute("role")).toBe("slider");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-color-picker label="Pick a color"></lily-color-picker>');

        expect(host.getAttribute("aria-label")).toBe("Pick a color");
    });

    test("seeds x/y from attributes and exposes aria-valuenow + data-x/data-y", () => {
        const host = render('<lily-color-picker label="Pick a color" x="20" y="30"></lily-color-picker>');

        expect(host.getAttribute("aria-valuenow")).toBe("20");
        expect(host.getAttribute("data-x")).toBe("20");
        expect(host.getAttribute("data-y")).toBe("30");
    });

    test("exposes live x/y properties", () => {
        const host = render('<lily-color-picker label="Pick a color"></lily-color-picker>') as unknown as ColorPicker;

        host.x = 55;
        host.y = 40;

        expect(host.x).toBe(55);
        expect(host.y).toBe(40);
        expect(host.getAttribute("data-x")).toBe("55");
    });

    test("ArrowRight increases x by 1, Shift+ArrowRight by 10", () => {
        const host = render('<lily-color-picker label="Pick a color" x="10"></lily-color-picker>') as unknown as ColorPicker;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(host.x).toBe(11);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", shiftKey: true, bubbles: true }));
        expect(host.x).toBe(21);
    });

    test("Home sets x to 0, End sets x to 100", () => {
        const host = render('<lily-color-picker label="Pick a color" x="50"></lily-color-picker>') as unknown as ColorPicker;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(host.x).toBe(0);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(host.x).toBe(100);
    });

    test("disabled sets tabindex=-1 and aria-disabled=true, and blocks keyboard changes", () => {
        const host = render(
            '<lily-color-picker label="Pick a color" x="10" disabled></lily-color-picker>',
        ) as unknown as ColorPicker;

        expect(host.tabIndex).toBe(-1);
        expect(host.getAttribute("aria-disabled")).toBe("true");

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(host.x).toBe(10);
    });

    test("fires lily-change with the updated x/y on keyboard interaction", () => {
        const host = render('<lily-color-picker label="Pick a color"></lily-color-picker>') as unknown as ColorPicker;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{ x: number; y: number }>;
        expect(event.detail).toEqual({ x: 0, y: 1 });
    });
});
