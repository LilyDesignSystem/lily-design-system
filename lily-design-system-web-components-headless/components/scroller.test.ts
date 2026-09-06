import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Scroller } from "./scroller.js";

if (!customElements.get("lily-scroller")) {
    customElements.define("lily-scroller", Scroller);
}

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let lastCallback: ObserverCallback | null = null;

class FakeIntersectionObserver {
    constructor(callback: ObserverCallback) {
        lastCallback = callback;
    }
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
    takeRecords(): [] {
        return [];
    }
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const MARKUP =
    '<lily-scroller label="Our story">' +
    '<div slot="background">Background media.</div>' +
    "<div>Step 1</div>" +
    "<div>Step 2</div>" +
    "</lily-scroller>";

describe("Scroller", () => {
    beforeEach(() => {
        lastCallback = null;
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
    });

    test("carries the base class", () => {
        const host = render(MARKUP);

        expect(host.classList.contains("scroller")).toBe(true);
    });

    test("uses label as the accessible name when provided", () => {
        const host = render(MARKUP);

        expect(host.getAttribute("aria-label")).toBe("Our story");
    });

    test("builds a sticky background region with the slotted content and aria-live=polite", () => {
        const host = render(MARKUP);

        const background = host.querySelector(".scroller-background")!;
        expect(background.getAttribute("aria-live")).toBe("polite");
        expect(background.textContent).toBe("Background media.");
    });

    test("builds a scroller-foreground scroller-base region with the remaining children as steps", () => {
        const host = render(MARKUP);

        const foreground = host.querySelector(".scroller-foreground")!;
        expect(foreground.classList.contains("scroller-base")).toBe(true);
        expect(foreground.children.length).toBe(2);
        expect(foreground.children[0].textContent).toBe("Step 1");
    });

    test("reports the active step index via the index property and lily-index-change", () => {
        const host = render(MARKUP) as unknown as Scroller;
        const handler = vi.fn();
        host.addEventListener("lily-index-change", handler);
        const stepTwo = host.querySelector(".scroller-foreground")!.children[1];

        lastCallback?.([{ isIntersecting: true, target: stepTwo } as unknown as IntersectionObserverEntry]);

        expect(host.index).toBe(1);
        expect(handler).toHaveBeenCalled();
    });
});
