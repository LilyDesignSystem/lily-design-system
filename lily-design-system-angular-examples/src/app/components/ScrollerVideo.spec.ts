import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollerVideo } from "./ScrollerVideo";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ScrollerVideo);
    for (const [key, value] of Object.entries({
        src: "/a.webm",
        label: "Story",
        alt: "A river",
        ...inputs,
    }))
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

describe("ScrollerVideo", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.scroller-video");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("a muted background video, described, behind the steps", async () => {
        const fixture = make();
        await fixture.whenStable();
        const root = fixture.nativeElement;
        const background = root.querySelector(".scroller-video-background");
        expect(background.getAttribute("role")).toBe("img");
        expect(background.getAttribute("aria-label")).toBe("A river");
        expect(background.getAttribute("aria-roledescription")).toBe("scrollable video");
        const video = root.querySelector("video.scroller-video-element");
        expect(video.muted).toBe(true);
        expect(video.hasAttribute("playsinline")).toBe(true);
        expect(root.querySelector("div.scroller-base.scroller-video-foreground")).toBeTruthy();
    });

    test("the video's time follows the progress", async () => {
        const fixture = make();
        await fixture.whenStable();
        const progress: number[] = [];
        fixture.componentInstance.progressChange.subscribe((value: number) => progress.push(value));
        const video = fixture.nativeElement.querySelector("video");
        Object.defineProperty(video, "duration", { value: 100 });
        fixture.nativeElement.querySelector(".scroller-base").getBoundingClientRect = () =>
            ({ top: -1000000, height: 100 }) as DOMRect;
        window.dispatchEvent(new Event("scroll"));
        expect(progress.at(-1)).toBe(1);
        expect(video.currentTime).toBe(100);
    });

    test("a video not loaded yet is left alone", async () => {
        const fixture = make();
        await fixture.whenStable();
        window.dispatchEvent(new Event("scroll"));
        expect(fixture.nativeElement.querySelector("video").currentTime).toBe(0);
    });

    test("is a named group when labelled", () => {
        const fixture = make();
        const el = fixture.nativeElement.querySelector("div.scroller-video");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});
