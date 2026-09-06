import { afterEach, describe, expect, test } from "vitest";

import { MeasurementSystemInput } from "./measurement-system-input.js";

if (!customElements.get("lily-measurement-system-input")) {
    customElements.define("lily-measurement-system-input", MeasurementSystemInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MeasurementSystemInput", () => {
    test("renders a native input type=text", () => {
        const host = render('<lily-measurement-system-input label="System"></lily-measurement-system-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("text");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-measurement-system-input label="System"></lily-measurement-system-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("System");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render(
            '<lily-measurement-system-input label="System" value="metric"></lily-measurement-system-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("metric");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-measurement-system-input label="System"></lily-measurement-system-input>',
        ) as unknown as MeasurementSystemInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "imperial";

        expect(input.value).toBe("imperial");
        expect(host.value).toBe("imperial");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-measurement-system-input label="System" required disabled></lily-measurement-system-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render(
            '<lily-measurement-system-input label="System" placeholder="e.g. metric"></lily-measurement-system-input>',
        );

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("e.g. metric");
    });
});
