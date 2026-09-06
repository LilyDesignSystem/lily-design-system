import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ScrollerVideo } from "./scroller-video.js";

if (!customElements.get("lily-scroller-video")) {
    customElements.define("lily-scroller-video", ScrollerVideo);
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
    '<lily-scroller-video src="/story.mp4" label="Our story in video" alt="A time-lapse of the harbour at dawn">' +
    "<div>Step 1</div>" +
    "<div>Step 2</div>" +
    "</lily-scroller-video>";

describe("ScrollerVideo", () => {
    beforeEach(() => {
        lastCallback = null;
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
    });

    test("carries the base class", () => {
        const host = render(MARKUP);

        expect(host.classList.contains("scroller-video")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render(MARKUP);

        expect(host.getAttribute("aria-label")).toBe("Our story in video");
    });

    test("renders a muted, playsinline video with the given src", () => {
        const host = render(MARKUP);

        const video = host.querySelector("video") as HTMLVideoElement;
        expect(video.src).toContain("/story.mp4");
        expect(video.muted).toBe(true);
        expect(video.playsInline).toBe(true);
    });

    test("wraps the video in a role=img background with aria-roledescription and alt text", () => {
        const host = render(MARKUP);

        const background = host.querySelector(".scroller-video-background")!;
        expect(background.getAttribute("role")).toBe("img");
        expect(background.getAttribute("aria-roledescription")).toBe("scrollable video");
        expect(background.getAttribute("aria-label")).toBe("A time-lapse of the harbour at dawn");
    });

    test("builds a scroller-video-foreground scroller-base region with the step children", () => {
        const host = render(MARKUP);

        const foreground = host.querySelector(".scroller-video-foreground")!;
        expect(foreground.classList.contains("scroller-base")).toBe(true);
        expect(foreground.children.length).toBe(2);
    });

    test("reports the active step index via the index property and lily-index-change", () => {
        const host = render(MARKUP) as unknown as ScrollerVideo;
        const handler = vi.fn();
        host.addEventListener("lily-index-change", handler);
        const stepTwo = host.querySelector(".scroller-video-foreground")!.children[1];

        lastCallback?.([{ isIntersecting: true, target: stepTwo } as unknown as IntersectionObserverEntry]);

        expect(host.index).toBe(1);
        expect(handler).toHaveBeenCalled();
    });
});
