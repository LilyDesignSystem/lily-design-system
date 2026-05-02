import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./VideoPlayer";

describe("VideoPlayer", () => {
    test("renders a figure with class video-player", () => {
        const { container } = render(<Subject src="/v.mp4" label="Demo" />);
        const fig = container.querySelector(".video-player");
        expect(fig).toBeTruthy();
        expect(fig?.tagName).toBe("FIGURE");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(<Subject src="/v.mp4" label="Demo video" />);
        expect(container.querySelector(".video-player")?.getAttribute("aria-label")).toBe("Demo video");
    });

    test("renders a video with src", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" />);
        const video = container.querySelector("video.video-player-element") as HTMLVideoElement;
        expect(video).toBeTruthy();
        expect(video.getAttribute("src")).toBe("/v.mp4");
    });

    test("controls default to true", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" />);
        expect(container.querySelector("video")?.hasAttribute("controls")).toBe(true);
    });

    test("controls false omits the controls attribute", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" controls={false} />);
        expect(container.querySelector("video")?.hasAttribute("controls")).toBe(false);
    });

    test("muted prop is reflected", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" muted />);
        expect((container.querySelector("video") as HTMLVideoElement).muted).toBe(true);
    });

    test("loop prop is reflected", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" loop />);
        expect((container.querySelector("video") as HTMLVideoElement).loop).toBe(true);
    });

    test("poster prop is reflected", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" poster="/poster.jpg" />);
        expect(container.querySelector("video")?.getAttribute("poster")).toBe("/poster.jpg");
    });

    test("renders caption inside figcaption when provided", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" caption="A caption" />);
        const cap = container.querySelector("figcaption.video-player-caption");
        expect(cap?.textContent).toBe("A caption");
    });

    test("omits figcaption when caption not provided", () => {
        const { container } = render(<Subject src="/v.mp4" label="x" />);
        expect(container.querySelector("figcaption")).toBeNull();
    });

    test("renders children inside controls overlay", () => {
        const { container } = render(<Subject src="/v.mp4" label="x"><button>Pause</button></Subject>);
        const ctl = container.querySelector(".video-player-controls");
        expect(ctl).toBeTruthy();
        expect(ctl?.textContent).toBe("Pause");
    });
});
