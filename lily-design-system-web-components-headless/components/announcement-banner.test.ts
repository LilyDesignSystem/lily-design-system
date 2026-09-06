import { afterEach, describe, expect, test, vi } from "vitest";

import { AnnouncementBanner } from "./announcement-banner.js";

if (!customElements.get("lily-announcement-banner")) {
    customElements.define("lily-announcement-banner", AnnouncementBanner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AnnouncementBanner", () => {
    test("the custom element itself is the landmark region (self-is-the-wrapper)", () => {
        const host = render('<lily-announcement-banner label="Site news">New feature launched.</lily-announcement-banner>');

        expect(host.className).toBe("announcement-banner");
        expect(host.getAttribute("role")).toBe("region");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-announcement-banner label="Site news">New feature.</lily-announcement-banner>');

        expect(host.getAttribute("aria-label")).toBe("Site news");
    });

    test("does not set aria-live unless live is present", () => {
        const host = render('<lily-announcement-banner label="Site news">New feature.</lily-announcement-banner>');

        expect(host.hasAttribute("aria-live")).toBe(false);
    });

    test("live sets aria-live=polite", () => {
        const host = render('<lily-announcement-banner label="Site news" live>New feature.</lily-announcement-banner>');

        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("does not render a dismiss button unless dismissible", () => {
        const host = render('<lily-announcement-banner label="Site news">New feature.</lily-announcement-banner>');

        expect(host.querySelector(".announcement-banner-dismiss")).toBeNull();
    });

    test("dismissible renders a dismiss button with dismiss-label as its accessible name", () => {
        const host = render(
            '<lily-announcement-banner label="Site news" dismissible dismiss-label="Dismiss">New feature.</lily-announcement-banner>',
        );

        expect(host.querySelector(".announcement-banner-dismiss")!.getAttribute("aria-label")).toBe("Dismiss");
    });

    test("dismissing fires lily-close and hides the banner", () => {
        const host = render(
            '<lily-announcement-banner label="Site news" dismissible dismiss-label="Dismiss">New feature.</lily-announcement-banner>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        (host.querySelector(".announcement-banner-dismiss") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
        expect(host.hidden).toBe(true);
    });
});
