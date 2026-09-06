import { afterEach, describe, expect, test } from "vitest";

import { DateField } from "./date-field.js";

if (!customElements.get("lily-date-field")) {
    customElements.define("lily-date-field", DateField);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DateField", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render('<lily-date-field label="Start date"></lily-date-field>');

        expect(host.className).toBe("date-field");
    });

    test("links the label to the input via for/id", () => {
        const host = render('<lily-date-field label="Start date"></lily-date-field>');

        const label = host.querySelector("label")!;
        const input = host.querySelector("input") as HTMLInputElement;
        expect(label.textContent).toBe("Start date");
        expect(label.htmlFor).toBe(input.id);
        expect(input.id).not.toBe("");
    });

    test("renders a native date input", () => {
        const host = render('<lily-date-field label="Start date" value="2026-06-01"></lily-date-field>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("date");
        expect(input.value).toBe("2026-06-01");
    });

    test("uses a caller-supplied id instead of auto-generating one", () => {
        const host = render('<lily-date-field label="Start date" id="start-date"></lily-date-field>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.id).toBe("start-date");
        expect(host.hasAttribute("id")).toBe(false);
    });

    test("renders a description paragraph linked via aria-describedby", () => {
        const host = render('<lily-date-field label="Birthday" description="Format: YYYY-MM-DD"></lily-date-field>');

        const input = host.querySelector("input") as HTMLInputElement;
        const description = host.querySelector("p")!;
        expect(description.textContent).toBe("Format: YYYY-MM-DD");
        expect(input.getAttribute("aria-describedby")).toBe(description.id);
    });

    test("renders an error with role=alert linked via aria-errormessage", () => {
        const host = render('<lily-date-field label="End date" error="Required"></lily-date-field>');

        const input = host.querySelector("input") as HTMLInputElement;
        const error = host.querySelector('[role="alert"]') as HTMLElement;
        expect(error.textContent).toBe("Required");
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input.getAttribute("aria-errormessage")).toBe(error.id);
    });

    test("required and disabled reflect onto the input", () => {
        const host = render('<lily-date-field label="Start date" required disabled></lily-date-field>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("removing the error attribute removes the error paragraph and ARIA", () => {
        const host = render('<lily-date-field label="End date" error="Required"></lily-date-field>');

        host.removeAttribute("error");

        const input = host.querySelector("input") as HTMLInputElement;
        expect(host.querySelector('[role="alert"]')).toBeNull();
        expect(input.hasAttribute("aria-invalid")).toBe(false);
    });

    test("exposes a live value property", () => {
        const host = render('<lily-date-field label="Start date"></lily-date-field>') as unknown as DateField;

        host.value = "2026-12-25";

        expect(host.value).toBe("2026-12-25");
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("2026-12-25");
    });
});
