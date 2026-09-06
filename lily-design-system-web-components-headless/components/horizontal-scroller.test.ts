import { afterEach, describe, expect, test } from "vitest";

import { HorizontalScroller } from "./horizontal-scroller.js";

if (!customElements.get("lily-horizontal-scroller")) {
    customElements.define("lily-horizontal-scroller", HorizontalScroller);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("HorizontalScroller", () => {
    test("renders as itself with the base class", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery"></lily-horizontal-scroller>');

        expect(host.tagName.toLowerCase()).toBe("lily-horizontal-scroller");
        expect(host.className).toBe("horizontal-scroller");
    });

    test("has role=region and the accessible name from label", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery"></lily-horizontal-scroller>');

        expect(host.getAttribute("role")).toBe("region");
        expect(host.getAttribute("aria-label")).toBe("Photo gallery");
    });

    test("is keyboard-focusable via tabindex=0", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery"></lily-horizontal-scroller>');

        expect(host.tabIndex).toBe(0);
    });

    test("ArrowRight scrolls the container forward", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery"></lily-horizontal-scroller>') as HorizontalScroller;
        host.scrollLeft = 100;
        const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
        host.dispatchEvent(event);

        expect(host.scrollLeft).toBe(140);
        expect(event.defaultPrevented).toBe(true);
    });

    test("ArrowLeft scrolls the container backward", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery"></lily-horizontal-scroller>') as HorizontalScroller;
        host.scrollLeft = 100;
        const event = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
        host.dispatchEvent(event);

        expect(host.scrollLeft).toBe(60);
        expect(event.defaultPrevented).toBe(true);
    });

    test("preserves children content in place", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery"><img src="a.jpg" alt="A" /></lily-horizontal-scroller>');

        expect(host.querySelector("img")).not.toBeNull();
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-horizontal-scroller label="Photo gallery" class="gallery"></lily-horizontal-scroller>');

        expect(host.className).toBe("horizontal-scroller gallery");
    });
});
