import { afterEach, describe, expect, test } from "vitest";

import { MeasurementInstanceInput } from "./measurement-instance-input.js";

if (!customElements.get("lily-measurement-instance-input")) {
    customElements.define("lily-measurement-instance-input", MeasurementInstanceInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MeasurementInstanceInput", () => {
    test("renders a native input type=text", () => {
        const host = render(
            '<lily-measurement-instance-input label="Weight"></lily-measurement-instance-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("text");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-measurement-instance-input label="Weight"></lily-measurement-instance-input>',
        );

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Weight");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render(
            '<lily-measurement-instance-input label="Weight" value="72 kg"></lily-measurement-instance-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("72 kg");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-measurement-instance-input label="Weight"></lily-measurement-instance-input>',
        ) as unknown as MeasurementInstanceInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "98.6 F";

        expect(input.value).toBe("98.6 F");
        expect(host.value).toBe("98.6 F");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render(
            '<lily-measurement-instance-input label="Weight" required disabled></lily-measurement-instance-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render(
            '<lily-measurement-instance-input label="Weight" placeholder="e.g. 72 kg"></lily-measurement-instance-input>',
        );

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("e.g. 72 kg");
    });
});
