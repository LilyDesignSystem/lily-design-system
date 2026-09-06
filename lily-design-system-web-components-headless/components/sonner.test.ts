import { afterEach, describe, expect, test } from "vitest";

import { Sonner } from "./sonner.js";

if (!customElements.get("lily-sonner")) {
    customElements.define("lily-sonner", Sonner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Sonner", () => {
    test("carries the base class", () => {
        const host = render('<lily-sonner label="Notifications"></lily-sonner>');

        expect(host.classList.contains("sonner")).toBe(true);
    });

    test("has role=region", () => {
        const host = render('<lily-sonner label="Notifications"></lily-sonner>');

        expect(host.getAttribute("role")).toBe("region");
    });

    test("uses aria-live=polite", () => {
        const host = render('<lily-sonner label="Notifications"></lily-sonner>');

        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sonner label="Notifications"></lily-sonner>');

        expect(host.getAttribute("aria-label")).toBe("Notifications");
    });

    test("keeps consumer-supplied toast content in place", () => {
        const host = render('<lily-sonner label="Notifications"><div role="status">Saved.</div></lily-sonner>');

        expect(host.querySelector('[role="status"]')?.textContent).toBe("Saved.");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-sonner label="Notifications" class="my-toasts"></lily-sonner>');

        expect(host.getAttribute("class")).toBe("sonner my-toasts");
    });
});
