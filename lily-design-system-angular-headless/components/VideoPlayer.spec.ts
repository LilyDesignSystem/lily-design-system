import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { VideoPlayer } from "./VideoPlayer";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(VideoPlayer);
    for (const [key, value] of Object.entries({ src: "/a.webm", label: "Tour", ...inputs }))
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

describe("VideoPlayer", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("figure.video-player");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named figure around a native video", () => {
        const root = make({ poster: "/a.png", loop: true, muted: true }).nativeElement;
        expect(root.querySelector("figure").hasAttribute("role")).toBe(false);
        expect(root.querySelector("figure").getAttribute("aria-label")).toBe("Tour");
        const video = root.querySelector("video.video-player-element");
        expect(video.getAttribute("src")).toBe("/a.webm");
        expect(video.getAttribute("poster")).toBe("/a.png");
        expect(video.loop).toBe(true);
        expect(video.muted).toBe(true);
        expect(video.controls).toBe(true);
        expect(video.hasAttribute("playsinline")).toBe(true);
    });

    test("without autoplay nothing watches it", async () => {
        const fixture = make();
        await fixture.whenStable();
        expect(observers.length).toBe(0);
    });

    test("autoplay plays in view and pauses out of it", async () => {
        const fixture = make({ autoplay: true });
        await fixture.whenStable();
        const video = fixture.nativeElement.querySelector("video");
        video.play = vi.fn().mockResolvedValue(undefined);
        video.pause = vi.fn();
        expect(observers[0].options?.threshold).toBe(0.5);
        expect(observers[0].targets).toEqual([video]);
        report(video, true);
        expect(video.play).toHaveBeenCalledTimes(1);
        report(video, false);
        expect(video.pause).toHaveBeenCalledTimes(1);
    });

    test("destroying it stops watching", async () => {
        const fixture = make({ autoplay: true });
        await fixture.whenStable();
        fixture.destroy();
        expect(observers[0].disconnected).toBe(true);
    });
});
