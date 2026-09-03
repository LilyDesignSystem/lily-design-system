import { afterEach, describe, expect, test } from "vitest";

import { Alert } from "./alert.js";

if (!customElements.get("lily-alert")) {
    customElements.define("lily-alert", Alert);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Alert", () => {
    test("the custom element itself is the live region (self-is-the-wrapper)", () => {
        const host = render("<lily-alert>Something went wrong.</lily-alert>");

        expect(host.className).toBe("alert");
        expect(host.getAttribute("aria-atomic")).toBe("true");
    });

    test("defaults to role=alert with aria-live=assertive", () => {
        const host = render("<lily-alert>Something went wrong.</lily-alert>");

        expect(host.getAttribute("role")).toBe("alert");
        expect(host.getAttribute("aria-live")).toBe("assertive");
    });

    test("role=status defaults aria-live to polite", () => {
        const host = render('<lily-alert role="status">Saved.</lily-alert>');

        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("an explicit live attribute overrides the role-derived default", () => {
        const host = render('<lily-alert live="off">Quiet update.</lily-alert>');

        expect(host.getAttribute("aria-live")).toBe("off");
    });

    test("defaults data-type to info", () => {
        const host = render("<lily-alert>Message.</lily-alert>");

        expect(host.getAttribute("data-type")).toBe("info");
    });

    test("honours an explicit type", () => {
        const host = render('<lily-alert type="error">Failed.</lily-alert>');

        expect(host.getAttribute("data-type")).toBe("error");
    });

    test("renders an optional heading before the existing content", () => {
        const host = render('<lily-alert heading="Error">Something went wrong.</lily-alert>');

        const p = host.querySelector("p")!;
        expect(p.querySelector("strong")!.textContent).toBe("Error");
        expect(host.firstElementChild).toBe(p);
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-alert heading="Error">Something went wrong.</lily-alert>');

        (host as unknown as Alert).connectedCallback();

        expect(host.querySelectorAll("p").length).toBe(1);
    });
});
