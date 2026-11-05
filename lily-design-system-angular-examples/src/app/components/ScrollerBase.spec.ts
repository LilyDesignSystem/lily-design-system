import { Component, PLATFORM_ID } from "@angular/core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollerBase } from "./ScrollerBase";

// jsdom has no IntersectionObserver; this one reports when told to.
const observers: { callback: IntersectionObserverCallback; options?: IntersectionObserverInit; targets: Element[]; disconnected: boolean }[] = [];
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
    observers.at(-1)!.callback([{ target, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver);

beforeEach(() => {
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
});
afterEach(() => vi.unstubAllGlobals());

@Component({
    standalone: true,
    imports: [ScrollerBase],
    template: `<lily-scroller-base
        label="Story"
        className="extra"
        [offset]="0.25"
        (indexChange)="indexes.push($event)"
        (progressChange)="progress.push($event)"
    >
        <section>One</section>
        <section>Two</section>
    </lily-scroller-base>`,
})
class TestHost {
    indexes: number[] = [];
    progress: number[] = [];
}

async function make() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
}

describe("ScrollerBase", () => {
    test("renders the root with the base class and the label", async () => {
        const root = (await make()).nativeElement.querySelector("div.scroller-base");
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("aria-label")).toBe("Story");
    });

    test("watches each step at the offset line", async () => {
        await make();
        expect(observers[0].targets.length).toBe(2);
        expect(observers[0].options?.rootMargin).toBe("-25.00% 0px -75.00% 0px");
    });

    test("reports the step that crosses the line, not one that leaves", async () => {
        const fixture = await make();
        const [, second] = observers[0].targets;
        report(second, true);
        report(second, false);
        expect(fixture.componentInstance.indexes).toEqual([1]);
    });

    test("reports progress, kept between 0 and 1", async () => {
        const fixture = await make();
        const root = fixture.nativeElement.querySelector("div.scroller-base");
        root.getBoundingClientRect = () => ({ top: -100000, height: 100 }) as DOMRect;
        window.dispatchEvent(new Event("scroll"));
        expect(fixture.componentInstance.progress.at(-1)).toBe(1);
        root.getBoundingClientRect = () => ({ top: 100000, height: 100 }) as DOMRect;
        window.dispatchEvent(new Event("scroll"));
        expect(fixture.componentInstance.progress.at(-1)).toBe(0);
    });

    test("prerendering touches no window", async () => {
        TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: "server" }] });
        const fixture = await make();
        const before = fixture.componentInstance.progress.length;
        window.dispatchEvent(new Event("scroll"));
        expect(before).toBe(0);
        expect(fixture.componentInstance.progress.length).toBe(0);
        expect(observers.length).toBe(0);
    });

    test("destroying it stops listening", async () => {
        const fixture = await make();
        const before = fixture.componentInstance.progress.length;
        const host = fixture.componentInstance;
        fixture.destroy();
        window.dispatchEvent(new Event("scroll"));
        expect(host.progress.length).toBe(before);
        expect(observers[0].disconnected).toBe(true);
    });
});
