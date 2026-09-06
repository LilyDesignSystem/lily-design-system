import { afterEach, describe, expect, test } from "vitest";

import { AngleSliderRangeInput } from "./angle-slider-range-input.js";

if (!customElements.get("lily-angle-slider-range-input")) {
    customElements.define("lily-angle-slider-range-input", AngleSliderRangeInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AngleSliderRangeInput", () => {
    test("renders a native input type=range with the base class", () => {
        const host = render('<lily-angle-slider-range-input label="Rotation"></lily-angle-slider-range-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("range");
        expect(input.classList.contains("angle-slider-range-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-angle-slider-range-input label="Rotation"></lily-angle-slider-range-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Rotation");
    });

    test("defaults min, max, step, and value", () => {
        const host = render('<lily-angle-slider-range-input label="Rotation"></lily-angle-slider-range-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("360");
        expect(input.step).toBe("1");
        expect(input.value).toBe("0");
    });

    test("min, max, step, and value attributes override the defaults", () => {
        const host = render(
            '<lily-angle-slider-range-input label="Rotation" min="10" max="180" step="15" value="90"></lily-angle-slider-range-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.min).toBe("10");
        expect(input.max).toBe("180");
        expect(input.step).toBe("15");
        expect(input.value).toBe("90");
    });

    test("sets aria-valuemin, aria-valuemax, aria-valuenow, and a suffixed aria-valuetext", () => {
        const host = render(
            '<lily-angle-slider-range-input label="Rotation" value="90"></lily-angle-slider-range-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("aria-valuemin")).toBe("0");
        expect(input.getAttribute("aria-valuemax")).toBe("360");
        expect(input.getAttribute("aria-valuenow")).toBe("90");
        expect(input.getAttribute("aria-valuetext")).toBe("90°");
    });

    test("value-text-suffix overrides the degree symbol", () => {
        const host = render(
            '<lily-angle-slider-range-input label="Rotation" value="90" value-text-suffix=" degrees"></lily-angle-slider-range-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-valuetext")).toBe("90 degrees");
    });

    test("updates aria-valuetext live on input events", () => {
        const host = render('<lily-angle-slider-range-input label="Rotation"></lily-angle-slider-range-input>');
        const input = host.querySelector("input") as HTMLInputElement;

        input.value = "45";
        input.dispatchEvent(new Event("input"));

        expect(input.getAttribute("aria-valuetext")).toBe("45°");
        expect(input.getAttribute("aria-valuenow")).toBe("45");
    });

    test("exposes a live numeric value property proxying the inner input", () => {
        const host = render(
            '<lily-angle-slider-range-input label="Rotation"></lily-angle-slider-range-input>',
        ) as unknown as AngleSliderRangeInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = 270;

        expect(input.value).toBe("270");
        expect(host.value).toBe(270);
        expect(input.getAttribute("aria-valuetext")).toBe("270°");
    });

    test("disabled propagates to the inner input", () => {
        const host = render('<lily-angle-slider-range-input label="Rotation" disabled></lily-angle-slider-range-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });
});
