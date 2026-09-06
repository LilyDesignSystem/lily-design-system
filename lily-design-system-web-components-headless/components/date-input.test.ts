import { afterEach, describe, expect, test } from "vitest";

import { DateInput } from "./date-input.js";

if (!customElements.get("lily-date-input")) {
    customElements.define("lily-date-input", DateInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DateInput", () => {
    test("renders a native input type=date with the base class", () => {
        const host = render('<lily-date-input label="Date of birth"></lily-date-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("date");
        expect(input.classList.contains("date-input")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-date-input label="Date of birth"></lily-date-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Date of birth");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-date-input label="Date of birth" value="1990-01-15"></lily-date-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("1990-01-15");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-date-input label="Date of birth"></lily-date-input>') as unknown as DateInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "2000-06-01";

        expect(input.value).toBe("2000-06-01");
        expect(host.value).toBe("2000-06-01");
    });

    test("min and max propagate to the inner input", () => {
        const host = render(
            '<lily-date-input label="Date of birth" min="1900-01-01" max="2026-01-01"></lily-date-input>',
        );

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.min).toBe("1900-01-01");
        expect(input.max).toBe("2026-01-01");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-date-input label="Date of birth" required disabled></lily-date-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });
});
