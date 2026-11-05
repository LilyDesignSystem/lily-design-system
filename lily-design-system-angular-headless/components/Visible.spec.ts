import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Visible } from "./Visible";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Visible);
    for (const [key, value] of Object.entries({ ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

// jsdom has no IntersectionObserver; this one reports when told to.
const observers: {
    callback: IntersectionObserverCallback;
    options?: IntersectionObserverInit;
    targets: Element[];
    disconnected: boolean;
}[] = [];
class FakeObserver {
    record: (typeof observers)[number];
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.record = { callback, options, targets: [], disconnected: false };
        observers.push(this.record);
    }
    observe(target: Element) {
        this.record.targets.push(target);
    }
    disconnect() {
        this.record.disconnected = true;
    }
}
const report = (target: Element, isIntersecting: boolean) =>
    observers
        .at(-1)!
        .callback(
            [{ target, isIntersecting } as IntersectionObserverEntry],
            {} as IntersectionObserver,
        );

beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
});
afterEach(() => vi.unstubAllGlobals());

describe("Visible", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.visible");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("reports whether it is on screen", async () => {
        const fixture = make();
        await fixture.whenStable();
        const root = fixture.nativeElement.querySelector("div");
        expect(root.getAttribute("data-visible")).toBe("false");
        report(root, true);
        fixture.detectChanges();
        expect(root.getAttribute("data-visible")).toBe("true");
        expect(fixture.componentInstance.visible()).toBe(true);
        report(root, false);
        fixture.detectChanges();
        expect(root.getAttribute("data-visible")).toBe("false");
    });

    test("threshold and rootMargin are passed on", async () => {
        const fixture = make({ threshold: 0.5, rootMargin: "10px" });
        await fixture.whenStable();
        expect(observers[0].options).toEqual({ threshold: 0.5, rootMargin: "10px" });
    });

    test("once stops watching the first time it is seen", async () => {
        const fixture = make({ once: true });
        await fixture.whenStable();
        report(fixture.nativeElement.querySelector("div"), true);
        expect(observers[0].disconnected).toBe(true);
    });

    test("destroying it stops watching", async () => {
        const fixture = make();
        await fixture.whenStable();
        fixture.destroy();
        expect(observers[0].disconnected).toBe(true);
    });
});
