import { afterEach, describe, expect, test } from "vitest";

import { MeasurementUnitInput } from "./measurement-unit-input.js";

if (!customElements.get("lily-measurement-unit-input")) {
    customElements.define("lily-measurement-unit-input", MeasurementUnitInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MeasurementUnitInput", () => {
    test("renders a native input type=text", () => {
        const host = render('<lily-measurement-unit-input label="Unit"></lily-measurement-unit-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("text");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-measurement-unit-input label="Unit"></lily-measurement-unit-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Unit");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-measurement-unit-input label="Unit" value="kg"></lily-measurement-unit-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("kg");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-measurement-unit-input label="Unit"></lily-measurement-unit-input>',
        ) as unknown as MeasurementUnitInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "lb";

        expect(input.value).toBe("lb");
        expect(host.value).toBe("lb");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-measurement-unit-input label="Unit" required disabled></lily-measurement-unit-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render(
            '<lily-measurement-unit-input label="Unit" placeholder="e.g. kg"></lily-measurement-unit-input>',
        );

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("e.g. kg");
    });
});
