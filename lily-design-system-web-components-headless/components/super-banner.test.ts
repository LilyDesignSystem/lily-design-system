import { afterEach, describe, expect, test, vi } from "vitest";

import { SuperBanner } from "./super-banner.js";

if (!customElements.get("lily-super-banner")) {
    customElements.define("lily-super-banner", SuperBanner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SuperBanner", () => {
    test("the custom element itself is the alert (self-is-the-wrapper)", () => {
        const host = render("<lily-super-banner>System maintenance in progress.</lily-super-banner>");

        expect(host.className).toBe("super-banner");
        expect(host.getAttribute("role")).toBe("alert");
        expect(host.getAttribute("aria-live")).toBe("assertive");
    });

    test("label is optional and sets aria-label when present", () => {
        const host = render('<lily-super-banner label="System outage">Maintenance in progress.</lily-super-banner>');

        expect(host.getAttribute("aria-label")).toBe("System outage");
    });

    test("does not render a dismiss button unless dismissable", () => {
        const host = render("<lily-super-banner>Maintenance in progress.</lily-super-banner>");

        expect(host.querySelector(".super-banner-dismiss")).toBeNull();
    });

    test("dismissable renders a dismiss button", () => {
        const host = render("<lily-super-banner dismissable>Maintenance in progress.</lily-super-banner>");

        expect(host.querySelector(".super-banner-dismiss")).toBeTruthy();
    });

    test("dismissing fires lily-close and hides the banner", () => {
        const host = render("<lily-super-banner dismissable>Maintenance in progress.</lily-super-banner>");
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        (host.querySelector(".super-banner-dismiss") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
        expect(host.hidden).toBe(true);
    });
});
