import { afterEach, describe, expect, test } from "vitest";

import { MonthInput } from "./month-input.js";

if (!customElements.get("lily-month-input")) {
    customElements.define("lily-month-input", MonthInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MonthInput", () => {
    test("renders a native input type=month", () => {
        const host = render('<lily-month-input label="Start month"></lily-month-input>');

        expect((host.querySelector("input") as HTMLInputElement).type).toBe("month");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-month-input label="Start month"></lily-month-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Start month");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-month-input label="Start month" value="2026-09"></lily-month-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("2026-09");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-month-input label="Start month"></lily-month-input>') as unknown as MonthInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "2026-12";

        expect(input.value).toBe("2026-12");
        expect(host.value).toBe("2026-12");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-month-input label="Start month" required disabled></lily-month-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as min and max", () => {
        const host = render('<lily-month-input label="Start month" min="2026-01" max="2026-12"></lily-month-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.getAttribute("min")).toBe("2026-01");
        expect(input.getAttribute("max")).toBe("2026-12");
    });
});
