import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ScrollerBase } from "./scroller-base.js";

if (!customElements.get("lily-scroller-base")) {
    customElements.define("lily-scroller-base", ScrollerBase);
}

// jsdom ships no IntersectionObserver. Stub a minimal, controllable one so
// tests can drive the callback directly, matching the Reuters-Graphics-
// inspired step-tracking contract this component implements.
type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let observed: { target: Element }[] = [];
let lastCallback: ObserverCallback | null = null;

class FakeIntersectionObserver {
    constructor(callback: ObserverCallback) {
        lastCallback = callback;
    }
    observe(target: Element): void {
        observed.push({ target });
    }
    disconnect(): void {
        observed = [];
    }
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

describe("ScrollerBase", () => {
    beforeEach(() => {
        observed = [];
        lastCallback = null;
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
    });

    test("carries the base class", () => {
        const host = render("<lily-scroller-base><div>Step 1</div></lily-scroller-base>");

        expect(host.classList.contains("scroller-base")).toBe(true);
    });

    test("sets aria-label when label is provided", () => {
        const host = render('<lily-scroller-base label="Story steps"><div>Step 1</div></lily-scroller-base>');

        expect(host.getAttribute("aria-label")).toBe("Story steps");
    });

    test("observes each direct child as a step", () => {
        render("<lily-scroller-base><div>Step 1</div><div>Step 2</div></lily-scroller-base>");

        expect(observed.length).toBe(2);
    });

    test("reports the active step index via data-index and the index property", () => {
        const host = render("<lily-scroller-base><div>Step 1</div><div>Step 2</div></lily-scroller-base>") as unknown as ScrollerBase;
        const stepTwo = host.children[1];

        lastCallback?.([{ isIntersecting: true, target: stepTwo } as unknown as IntersectionObserverEntry]);

        expect(host.getAttribute("data-index")).toBe("1");
        expect(host.index).toBe(1);
    });

    test("dispatches lily-index-change when the active step changes", () => {
        const host = render("<lily-scroller-base><div>Step 1</div></lily-scroller-base>") as unknown as ScrollerBase;
        const handler = vi.fn();
        host.addEventListener("lily-index-change", handler);
        const stepOne = host.children[0];

        lastCallback?.([{ isIntersecting: true, target: stepOne } as unknown as IntersectionObserverEntry]);

        expect(handler).toHaveBeenCalled();
    });

    test("keeps step children in place", () => {
        const host = render("<lily-scroller-base><div>Step 1</div><div>Step 2</div></lily-scroller-base>");

        expect(host.children.length).toBe(2);
        expect(host.children[0].textContent).toBe("Step 1");
    });
});
