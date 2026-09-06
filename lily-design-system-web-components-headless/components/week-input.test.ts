import { afterEach, describe, expect, test } from "vitest";

import { WeekInput } from "./week-input.js";

if (!customElements.get("lily-week-input")) {
    customElements.define("lily-week-input", WeekInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("WeekInput", () => {
    test("renders a native input type=week", () => {
        const host = render('<lily-week-input label="Sprint start week"></lily-week-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("week");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-week-input label="Sprint start week"></lily-week-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Sprint start week");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-week-input label="Sprint start week" value="2024-W01"></lily-week-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("2024-W01");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render(
            '<lily-week-input label="Sprint start week"></lily-week-input>',
        ) as unknown as WeekInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "2024-W10";

        expect(input.value).toBe("2024-W10");
        expect(host.value).toBe("2024-W10");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-week-input label="Sprint start week" required disabled></lily-week-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as min", () => {
        const host = render('<lily-week-input label="Sprint start week" min="2024-W01"></lily-week-input>');

        expect(host.querySelector("input")!.getAttribute("min")).toBe("2024-W01");
    });
});
