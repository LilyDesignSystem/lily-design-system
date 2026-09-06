import { afterEach, describe, expect, test, vi } from "vitest";

import { Slider } from "./slider.js";

if (!customElements.get("lily-slider")) {
    customElements.define("lily-slider", Slider);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Slider", () => {
    test("carries the base class", () => {
        const host = render('<lily-slider label="Volume"></lily-slider>');

        expect(host.classList.contains("slider")).toBe(true);
    });

    test("has role=slider, not a native input type=range", () => {
        const host = render('<lily-slider label="Volume"></lily-slider>');

        expect(host.getAttribute("role")).toBe("slider");
        expect(host.querySelector("input")).toBeNull();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slider label="Volume"></lily-slider>');

        expect(host.getAttribute("aria-label")).toBe("Volume");
    });

    test("defaults value/min/max to 50/0/100", () => {
        const host = render('<lily-slider label="Volume"></lily-slider>');

        expect(host.getAttribute("aria-valuenow")).toBe("50");
        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("is keyboard-focusable via tabindex=0", () => {
        const host = render('<lily-slider label="Volume"></lily-slider>');

        expect(host.tabIndex).toBe(0);
    });

    test("ArrowRight increases the value by one step and dispatches lily-change", () => {
        const host = render('<lily-slider label="Volume" value="50" step="5"></lily-slider>') as unknown as Slider;
        const handler = vi.fn();
        host.addEventListener("lily-change", handler);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

        expect(host.value).toBe(55);
        expect(host.getAttribute("aria-valuenow")).toBe("55");
        expect(handler).toHaveBeenCalled();
    });

    test("ArrowLeft decreases the value by one step", () => {
        const host = render('<lily-slider label="Volume" value="50" step="5"></lily-slider>') as unknown as Slider;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

        expect(host.value).toBe(45);
    });

    test("Home jumps to min, End jumps to max", () => {
        const host = render('<lily-slider label="Volume" value="50" min="0" max="100"></lily-slider>') as unknown as Slider;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(host.value).toBe(0);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(host.value).toBe(100);
    });

    test("clamps the value to min/max", () => {
        const host = render('<lily-slider label="Volume" value="98" step="10" max="100"></lily-slider>') as unknown as Slider;

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

        expect(host.value).toBe(100);
    });

    test("disabled prevents keyboard adjustment and sets aria-disabled + tabindex=-1", () => {
        const host = render('<lily-slider label="Volume" value="50" disabled></lily-slider>') as unknown as Slider;

        expect(host.getAttribute("aria-disabled")).toBe("true");
        expect(host.tabIndex).toBe(-1);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(host.value).toBe(50);
    });
});
