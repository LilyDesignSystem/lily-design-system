import { afterEach, describe, expect, test } from "vitest";

import { NumberInput } from "./number-input.js";

if (!customElements.get("lily-number-input")) {
    customElements.define("lily-number-input", NumberInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("NumberInput", () => {
    test("renders a native input type=number", () => {
        const host = render('<lily-number-input label="Age"></lily-number-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("number");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-number-input label="Age"></lily-number-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Age");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-number-input label="Age" value="42"></lily-number-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("42");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-number-input label="Age"></lily-number-input>') as unknown as NumberInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "7";

        expect(input.value).toBe("7");
        expect(host.value).toBe("7");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-number-input label="Age" required disabled></lily-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through min, max, and step", () => {
        const host = render('<lily-number-input label="Age" min="0" max="120" step="1"></lily-number-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.min).toBe("0");
        expect(input.max).toBe("120");
        expect(input.step).toBe("1");
    });
});
