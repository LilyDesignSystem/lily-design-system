// ScrollerVideo component
//
// A video-driven scrollytelling component: a muted <video> whose
// currentTime advances proportionally to scroll progress, with
// foreground step children scrolling over it. The custom element
// stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName). Same locally-duplicated
// step-tracking primitive as Scroller/ScrollerBase (see scroller.ts's
// header comment for why it is not composed via a nested custom
// element instance).
//
// Attributes:
//   src — REQUIRED. Video source URL.
//   label — REQUIRED. Accessible label describing the video story, via
//     aria-label.
//   alt — REQUIRED. Text alternative describing the video content.
//   offset — number (default 0.5). Viewport offset (0-1) where a step
//     triggers.
//
// The video is always muted (scroll-driven, not time-driven) and marked
// playsinline/preload=auto, matching the canonical contract.
//
// References:
//   - components/scroller-video/index.md (canonical contract)
//   - Reuters Graphics ScrollerVideo
//   - WebCodecs API

import { applySelfClassName } from "../lib/dom-utils.js";

export class ScrollerVideo extends HTMLElement {
    #built = false;
    #observer: IntersectionObserver | null = null;
    #foreground: HTMLElement | null = null;
    #video: HTMLVideoElement | null = null;
    #index = 0;
    #progress = 0;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "scroller-video");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const steps = Array.from(this.children);

        const background = document.createElement("div");
        background.className = "scroller-video-background";
        background.setAttribute("role", "img");
        background.setAttribute("aria-roledescription", "scrollable video");
        const alt = this.getAttribute("alt");
        if (alt !== null) background.setAttribute("aria-label", alt);

        const video = document.createElement("video");
        video.className = "scroller-video-element";
        video.src = this.getAttribute("src") ?? "";
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        background.appendChild(video);
        this.#video = video;

        const foreground = document.createElement("div");
        foreground.className = "scroller-video-foreground scroller-base";
        for (const step of steps) foreground.appendChild(step);

        this.replaceChildren(background, foreground);
        this.#foreground = foreground;

        this.#setupStepTracking();
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
        if (typeof window !== "undefined") window.removeEventListener("scroll", this.#onScroll);
    }

    get #offset(): number {
        const raw = this.getAttribute("offset");
        return raw !== null ? Number(raw) : 0.5;
    }

    get index(): number {
        return this.#index;
    }

    get progress(): number {
        return this.#progress;
    }

    #setupStepTracking(): void {
        const foreground = this.#foreground;
        if (!foreground || typeof IntersectionObserver === "undefined") return;

        const steps = Array.from(foreground.children) as HTMLElement[];
        const offset = this.#offset;
        const top = (offset * 100).toFixed(2);
        const bottom = (100 - offset * 100).toFixed(2);

        this.#observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const idx = steps.indexOf(entry.target as HTMLElement);
                        if (idx !== -1) this.#setIndex(idx);
                    }
                }
            },
            { rootMargin: `-${top}% 0px -${bottom}% 0px`, threshold: 0 },
        );
        for (const step of steps) this.#observer.observe(step);

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", this.#onScroll, { passive: true });
            this.#onScroll();
        }
    }

    #onScroll = (): void => {
        const rect = this.getBoundingClientRect();
        const winH = window.innerHeight || 1;
        const total = rect.height + winH;
        const passed = winH - rect.top;
        this.#setProgress(Math.max(0, Math.min(1, passed / total)));
    };

    #setIndex(index: number): void {
        this.#index = index;
        this.setAttribute("data-index", String(index));
        this.dispatchEvent(
            new CustomEvent("lily-index-change", { detail: { index }, bubbles: true, composed: true }),
        );
    }

    #setProgress(progress: number): void {
        this.#progress = progress;
        this.setAttribute("data-progress", String(progress));
        const video = this.#video;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = video.duration * progress;
        }
        this.dispatchEvent(
            new CustomEvent("lily-progress-change", { detail: { progress }, bubbles: true, composed: true }),
        );
    }
}
