import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollerVideo";

describe("ScrollerVideo", () => {
    test("renders a div with class scroller-video", () => {
        const { container } = render(
            <Subject src="/v.mp4" label="Story" alt="A scrolling video">
                <section>step</section>
            </Subject>
        );
        const root = container.querySelector(".scroller-video");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(
            <Subject src="/v.mp4" label="Story" alt="alt">
                <section>step</section>
            </Subject>
        );
        expect(container.querySelector(".scroller-video")?.getAttribute("aria-label")).toBe("Story");
    });

    test("renders a video with the src and muted attribute", () => {
        const { container } = render(
            <Subject src="/v.mp4" label="x" alt="alt">
                <section>step</section>
            </Subject>
        );
        const video = container.querySelector("video.scroller-video-element") as HTMLVideoElement;
        expect(video).toBeTruthy();
        expect(video.getAttribute("src")).toBe("/v.mp4");
        // The `muted` attribute is reflected as a property
        expect(video.muted).toBe(true);
    });

    test("background region exposes role=img with alt as aria-label", () => {
        const { container } = render(
            <Subject src="/v.mp4" label="x" alt="A waterfall scene">
                <section>step</section>
            </Subject>
        );
        const bg = container.querySelector(".scroller-video-background");
        expect(bg?.getAttribute("role")).toBe("img");
        expect(bg?.getAttribute("aria-roledescription")).toBe("scrollable video");
        expect(bg?.getAttribute("aria-label")).toBe("A waterfall scene");
    });

    test("renders children inside the foreground", () => {
        const { container } = render(
            <Subject src="/v.mp4" label="x" alt="alt">
                <section>step 1</section>
                <section>step 2</section>
            </Subject>
        );
        const fg = container.querySelector(".scroller-video-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });
});
