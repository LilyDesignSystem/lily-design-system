import { afterEach, describe, expect, test, vi } from "vitest";

import { VideoPlayer } from "./video-player.js";

if (!customElements.get("lily-video-player")) {
    customElements.define("lily-video-player", VideoPlayer);
}

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

type IntersectionCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

class FakeIntersectionObserver {
    static instances: FakeIntersectionObserver[] = [];
    callback: IntersectionCallback;
    observed: Element | null = null;
    disconnected = false;

    constructor(callback: IntersectionCallback) {
        this.callback = callback;
        FakeIntersectionObserver.instances.push(this);
    }

    observe(target: Element): void {
        this.observed = target;
    }

    disconnect(): void {
        this.disconnected = true;
    }

    trigger(isIntersecting: boolean): void {
        this.callback([{ isIntersecting, target: this.observed as Element }]);
    }
}

describe("VideoPlayer", () => {
    test("renders a figure with class video-player", () => {
        const host = render('<lily-video-player src="/v.mp4" label="Demo"></lily-video-player>');

        const fig = host.querySelector(".video-player");
        expect(fig).toBeTruthy();
        expect(fig?.tagName).toBe("FIGURE");
    });

    test("applies aria-label from label", () => {
        const host = render('<lily-video-player src="/v.mp4" label="Demo video"></lily-video-player>');

        expect(host.querySelector(".video-player")?.getAttribute("aria-label")).toBe("Demo video");
    });

    test("renders a video with src", () => {
        const host = render('<lily-video-player src="/v.mp4" label="x"></lily-video-player>');

        const video = host.querySelector("video.video-player-element") as HTMLVideoElement;
        expect(video).toBeTruthy();
        expect(video.getAttribute("src")).toBe("/v.mp4");
    });

    test("controls default to true", () => {
        const host = render('<lily-video-player src="/v.mp4" label="x"></lily-video-player>');

        expect((host.querySelector("video") as HTMLVideoElement).controls).toBe(true);
    });

    test("controls=false omits native controls", () => {
        const host = render('<lily-video-player src="/v.mp4" label="x" controls="false"></lily-video-player>');

        expect((host.querySelector("video") as HTMLVideoElement).controls).toBe(false);
    });

    test("muted and loop are reflected", () => {
        const host = render('<lily-video-player src="/v.mp4" label="x" muted loop></lily-video-player>');

        const video = host.querySelector("video") as HTMLVideoElement;
        expect(video.muted).toBe(true);
        expect(video.loop).toBe(true);
    });

    test("poster is reflected", () => {
        const host = render('<lily-video-player src="/v.mp4" label="x" poster="/poster.jpg"></lily-video-player>');

        expect((host.querySelector("video") as HTMLVideoElement).getAttribute("poster")).toBe("/poster.jpg");
    });

    test("renders caption inside figcaption via slot=caption", () => {
        const host = render(
            '<lily-video-player src="/v.mp4" label="x"><span slot="caption">A caption</span></lily-video-player>',
        );

        expect(host.querySelector("figcaption.video-player-caption")?.textContent).toBe("A caption");
    });

    test("omits figcaption when no caption slot is given", () => {
        const host = render('<lily-video-player src="/v.mp4" label="x"></lily-video-player>');

        expect(host.querySelector("figcaption")).toBeNull();
    });

    test("renders unslotted children inside a controls overlay", () => {
        const host = render(
            '<lily-video-player src="/v.mp4" label="x"><button>Pause</button></lily-video-player>',
        );

        const overlay = host.querySelector(".video-player-controls");
        expect(overlay?.textContent).toBe("Pause");
    });

    test("plays on intersect and pauses on scroll-out when autoplay is set", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        const video = window.HTMLMediaElement.prototype;
        const play = vi.spyOn(video, "play").mockResolvedValue(undefined);
        const pause = vi.spyOn(video, "pause").mockImplementation(() => {});

        render('<lily-video-player src="/v.mp4" label="x" autoplay></lily-video-player>');
        const observer = FakeIntersectionObserver.instances.at(-1)!;

        observer.trigger(true);
        expect(play).toHaveBeenCalledTimes(1);

        observer.trigger(false);
        expect(pause).toHaveBeenCalledTimes(1);

        play.mockRestore();
        pause.mockRestore();
    });

    test("does not construct an IntersectionObserver when autoplay is absent", () => {
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver as unknown as typeof IntersectionObserver);
        FakeIntersectionObserver.instances = [];

        render('<lily-video-player src="/v.mp4" label="x"></lily-video-player>');

        expect(FakeIntersectionObserver.instances.length).toBe(0);
    });
});
