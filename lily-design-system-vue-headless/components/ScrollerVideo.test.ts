import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ScrollerVideo.vue";

describe("ScrollerVideo", () => {
    test("renders a div with class scroller-video", () => {
        const { container } = render(Subject, {
            props: { src: "/v.mp4", label: "Story", alt: "A video" },
            slots: { default: "<section>step</section>" },
        });
        const root = container.querySelector(".scroller-video");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, {
            props: { src: "/v.mp4", label: "Story", alt: "alt" },
            slots: { default: "<section>step</section>" },
        });
        expect(container.querySelector(".scroller-video")?.getAttribute("aria-label")).toBe("Story");
    });

    test("renders a video with the src attribute", () => {
        const { container } = render(Subject, {
            props: { src: "/v.mp4", label: "x", alt: "alt" },
            slots: { default: "<section>step</section>" },
        });
        const video = container.querySelector("video.scroller-video-element") as HTMLVideoElement;
        expect(video).toBeTruthy();
        expect(video.getAttribute("src")).toBe("/v.mp4");
    });

    test("background region exposes role=img with alt as aria-label", () => {
        const { container } = render(Subject, {
            props: { src: "/v.mp4", label: "x", alt: "A waterfall scene" },
            slots: { default: "<section>step</section>" },
        });
        const bg = container.querySelector(".scroller-video-background");
        expect(bg?.getAttribute("role")).toBe("img");
        expect(bg?.getAttribute("aria-roledescription")).toBe("scrollable video");
        expect(bg?.getAttribute("aria-label")).toBe("A waterfall scene");
    });

    test("renders default slot inside the foreground", () => {
        const { container } = render(Subject, {
            props: { src: "/v.mp4", label: "x", alt: "alt" },
            slots: { default: "<section>step 1</section><section>step 2</section>" },
        });
        const fg = container.querySelector(".scroller-video-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });
});
