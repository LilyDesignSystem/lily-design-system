import { render } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ScrollerVideo.svelte";

function snippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
    }) as any;
}

describe("ScrollerVideo", () => {
    test("renders a div with class scroller-video", () => {
        const { container } = render(Subject, {
            src: "/v.mp4",
            label: "Story",
            alt: "A video",
            children: snippet("<section>step</section>"),
        });
        const root = container.querySelector(".scroller-video");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, {
            src: "/v.mp4",
            label: "Story",
            alt: "alt",
            children: snippet("<section>step</section>"),
        });
        expect(container.querySelector(".scroller-video")?.getAttribute("aria-label")).toBe(
            "Story",
        );
    });

    test("renders a video with the src attribute", () => {
        const { container } = render(Subject, {
            src: "/v.mp4",
            label: "x",
            alt: "alt",
            children: snippet("<section>step</section>"),
        });
        const video = container.querySelector("video.scroller-video-element");
        expect(video).toBeTruthy();
        expect(video?.getAttribute("src")).toBe("/v.mp4");
    });

    test("background region exposes role=img with alt as aria-label", () => {
        const { container } = render(Subject, {
            src: "/v.mp4",
            label: "x",
            alt: "A waterfall scene",
            children: snippet("<section>step</section>"),
        });
        const bg = container.querySelector(".scroller-video-background");
        expect(bg?.getAttribute("role")).toBe("img");
        expect(bg?.getAttribute("aria-roledescription")).toBe("scrollable video");
        expect(bg?.getAttribute("aria-label")).toBe("A waterfall scene");
    });

    test("renders children inside the foreground", () => {
        const { container } = render(Subject, {
            src: "/v.mp4",
            label: "x",
            alt: "alt",
            children: snippet("<section>step 1</section><section>step 2</section>"),
        });
        const fg = container.querySelector(".scroller-video-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });

    test("is a named group when labelled", () => {
        const { container } = render(Subject, {
            label: "Story",
            src: "a.mp4",
            alt: "Alt",
            children: snippet("content"),
        });
        const root = container.querySelector(".scroller-video");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("scroll progress seeks the video to the same fraction of its duration", () => {
        class StubObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
            takeRecords() {
                return [];
            }
        }
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const duration = vi
            .spyOn(HTMLMediaElement.prototype, "duration", "get")
            .mockReturnValue(80);
        try {
            const onProgressChange = vi.fn();
            const { container } = render(Subject, {
                props: {
                    label: "Story",
                    src: "/clip.mp4",
                    alt: "A river",
                    onProgressChange,
                    children: snippet("<p>Step</p>"),
                },
            });
            const video = container.querySelector("video") as HTMLVideoElement;
            expect(onProgressChange).toHaveBeenCalled();
            const progress = onProgressChange.mock.calls.at(-1)![0] as number;
            expect(video.currentTime).toBeCloseTo(80 * progress);
        } finally {
            duration.mockRestore();
            vi.unstubAllGlobals();
        }
    });
});
