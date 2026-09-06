import { afterEach, describe, expect, test, vi } from "vitest";

import { Dial } from "./dial.js";

if (!customElements.get("lily-dial")) {
    customElements.define("lily-dial", Dial);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Dial", () => {
    test("carries the base class and role=slider", () => {
        const host = render('<lily-dial label="Volume"></lily-dial>');

        expect(host.className).toBe("dial");
        expect(host.getAttribute("role")).toBe("slider");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-dial label="Volume"></lily-dial>');

        expect(host.getAttribute("aria-label")).toBe("Volume");
    });

    test("defaults value/min/max and exposes them via ARIA", () => {
        const host = render('<lily-dial label="Volume"></lily-dial>');

        expect(host.getAttribute("aria-valuenow")).toBe("0");
        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("seeds value/min/max/step from attributes", () => {
        const host = render(
            '<lily-dial label="Brightness" value="30" min="10" max="90" step="5"></lily-dial>',
        ) as unknown as Dial;

        expect(host.value).toBe(30);
        expect(host.getAttribute("aria-valuemin")).toBe("10");
        expect(host.getAttribute("aria-valuemax")).toBe("90");
    });

    test("ArrowRight/ArrowUp increase, ArrowLeft/ArrowDown decrease by one step", () => {
        const host = render('<lily-dial label="Volume" value="50"></lily-dial>') as unknown as Dial;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(host.value).toBe(51);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(host.value).toBe(50);
    });

    test("Shift+Arrow adjusts by 10 steps", () => {
        const host = render('<lily-dial label="Volume" value="50"></lily-dial>') as unknown as Dial;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", shiftKey: true, bubbles: true }));

        expect(host.value).toBe(60);
    });

    test("Home sets value to min, End sets value to max", () => {
        const host = render('<lily-dial label="Volume" value="50" min="10" max="90"></lily-dial>') as unknown as Dial;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(host.value).toBe(10);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(host.value).toBe(90);
    });

    test("disabled sets tabindex=-1 and aria-disabled=true, and blocks keyboard changes", () => {
        const host = render('<lily-dial label="Volume" value="50" disabled></lily-dial>') as unknown as Dial;

        expect(host.tabIndex).toBe(-1);
        expect(host.getAttribute("aria-disabled")).toBe("true");

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(host.value).toBe(50);
    });

    test("fires lily-change with the updated value on keyboard interaction", () => {
        const host = render('<lily-dial label="Volume" value="50"></lily-dial>') as unknown as Dial;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
        const event = handler.mock.calls[0][0] as CustomEvent<{ value: number }>;
        expect(event.detail).toEqual({ value: 51 });
    });
});
