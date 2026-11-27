import { afterEach, describe, expect, test, vi } from "vitest";

import { Banner } from "./banner.js";

if (!customElements.get("lily-banner")) {
    customElements.define("lily-banner", Banner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Banner", () => {
    test("the custom element itself is the landmark region (self-is-the-wrapper)", () => {
        const host = render("<lily-banner>New version available.</lily-banner>");

        expect(host.className).toBe("banner");
        expect(host.getAttribute("role")).toBe("region");
        expect(host.getAttribute("aria-live")).toBe("polite");
    });

    test("defaults data-type to info", () => {
        const host = render("<lily-banner>New version available.</lily-banner>");

        expect(host.getAttribute("data-type")).toBe("info");
    });

    test("does not render a dismiss button unless dismissible", () => {
        const host = render("<lily-banner>New version available.</lily-banner>");

        expect(host.querySelector(".banner-dismiss")).toBeNull();
    });

    test("dismissible renders a dismiss button with close-label as its accessible name", () => {
        const host = render(
            '<lily-banner dismissible close-label="Dismiss">New version available.</lily-banner>',
        );

        expect(host.querySelector(".banner-dismiss")!.getAttribute("aria-label")).toBe("Dismiss");
    });

    test("dismissing fires lily-close and hides the banner", () => {
        const host = render(
            '<lily-banner dismissible close-label="Dismiss">New version available.</lily-banner>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        (host.querySelector(".banner-dismiss") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
        expect(host.hidden).toBe(true);
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-banner type="info">Note</lily-banner>`;
        const el = document.querySelector("lily-banner")!;
        el.setAttribute("type", "warning");
        el.setAttribute("dismissible", "");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.getAttribute("data-type")).toBe("warning");
        expect(el.querySelectorAll("button.banner-dismiss").length).toBe(1);
    });
});
