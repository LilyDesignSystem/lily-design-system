import { afterEach, describe, expect, test, vi } from "vitest";

import { StickyPromoBanner } from "./sticky-promo-banner.js";

if (!customElements.get("lily-sticky-promo-banner")) {
    customElements.define("lily-sticky-promo-banner", StickyPromoBanner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("StickyPromoBanner", () => {
    test("renders a native aside with role=complementary", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion">Save 20% this week.</lily-sticky-promo-banner>');

        const aside = host.querySelector("aside")!;
        expect(aside.className).toBe("sticky-promo-banner");
        expect(aside.getAttribute("role")).toBe("complementary");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion">Save 20%.</lily-sticky-promo-banner>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Promotion");
    });

    test("defaults data-position to bottom with a fixed inline style", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion">Save 20%.</lily-sticky-promo-banner>');

        const aside = host.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("data-position")).toBe("bottom");
        expect(aside.style.position).toBe("fixed");
        expect(aside.style.bottom).toBe("0px");
    });

    test("position=top sets data-position and the top inline style", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion" position="top">Save 20%.</lily-sticky-promo-banner>');

        const aside = host.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("data-position")).toBe("top");
        expect(aside.style.top).toBe("0px");
    });

    test("open=false hides the aside", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion" open="false">Save 20%.</lily-sticky-promo-banner>');

        expect((host.querySelector("aside") as HTMLElement).hidden).toBe(true);
    });

    test("does not render a dismiss button unless dismissible", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion">Save 20%.</lily-sticky-promo-banner>');

        expect(host.querySelector(".sticky-promo-banner-dismiss")).toBeNull();
    });

    test("dismissible renders a dismiss button with dismiss-label as its accessible name, and dismissing fires lily-close", () => {
        const host = render(
            '<lily-sticky-promo-banner label="Promotion" dismissible dismiss-label="Dismiss promotion">Save 20%.</lily-sticky-promo-banner>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);
        const button = host.querySelector(".sticky-promo-banner-dismiss") as HTMLButtonElement;
        expect(button.getAttribute("aria-label")).toBe("Dismiss promotion");

        button.click();

        expect(handler).toHaveBeenCalled();
        expect((host.querySelector("aside") as HTMLElement).hidden).toBe(true);
    });

    test("moves the consumer's content into the content wrapper", () => {
        const host = render('<lily-sticky-promo-banner label="Promotion">Save 20% this week.</lily-sticky-promo-banner>');

        expect(host.querySelector(".sticky-promo-banner-content")!.textContent).toBe("Save 20% this week.");
    });
});
