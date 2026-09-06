// VideoPlayer component
//
// A <video> player with play-in-view behavior, custom controls, and
// IntersectionObserver support. Renders a <figure> with a real <video>
// child. When `autoplay` is set, the video plays when scrolled into the
// viewport and pauses when scrolled out (IntersectionObserver, threshold
// 0.5) — no native `autoplay` attribute is used, since the play-in-view
// behaviour must also pause on scroll-out.
//
// DEVIATION FLAG: this catalog's own root AGENTS.md documents the HTML
// tag as "<div> containing <video>" (matching the plain-HTML sibling
// catalog), but the Svelte AND React canonical implementations both
// render a <figure> (with an optional <figcaption> for the caption) —
// the more specific, semantically correct choice per AGENTS/headless.md,
// and the majority of the cross-checked reference implementations. This
// port follows <figure>.
//
// `caption` is a "slot" per the canonical contract; since this catalog is
// light-DOM only (no shadow root), a slotted child is marked
// `slot="caption"` (same convention as feature-photo.ts). Any other,
// unslotted children are treated as a custom controls overlay, matching
// the framework ports' `children` prop.
//
// Attributes:
//   src — REQUIRED. Video source URL.
//   label — REQUIRED. Accessible label for the video, via aria-label.
//   poster — optional.
//   autoplay — presence-based boolean; play-in-view via IntersectionObserver.
//   muted, loop — presence-based booleans.
//   controls — "true" | "false", default true (absent = true; matches
//     Dialog's `modal` idiom in this catalog).
//
// References:
//   - components/video-player/index.md (canonical contract)
//   - AGENTS/headless.md ("VideoPlayer.autoplay" named as a component-owned behaviour)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "label", "poster", "autoplay", "muted", "loop", "controls"]);

export class VideoPlayer extends HTMLElement {
    #video: HTMLVideoElement | null = null;
    #observer: IntersectionObserver | null = null;

    connectedCallback(): void {
        if (this.querySelector(":scope > figure.video-player")) return;

        const figure = document.createElement("figure");
        figure.className = rootClassName(this, "video-player");
        const label = this.getAttribute("label");
        if (label !== null) figure.setAttribute("aria-label", label);
        passThroughAttributes(this, figure, HANDLED);

        const video = document.createElement("video");
        video.className = "video-player-element";
        video.src = this.getAttribute("src") ?? "";
        const poster = this.getAttribute("poster");
        if (poster !== null) video.setAttribute("poster", poster);
        video.muted = this.hasAttribute("muted");
        video.loop = this.hasAttribute("loop");
        video.controls = this.getAttribute("controls") !== "false";
        video.setAttribute("playsinline", "");
        figure.appendChild(video);

        const controlsContent = Array.from(this.querySelectorAll(":scope > :not([slot])"));
        if (controlsContent.length > 0) {
            const controlsOverlay = document.createElement("div");
            controlsOverlay.className = "video-player-controls";
            for (const node of controlsContent) controlsOverlay.appendChild(node);
            figure.appendChild(controlsOverlay);
        }

        const captionContent = this.querySelector(':scope > [slot="caption"]');
        if (captionContent) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "video-player-caption";
            figcaption.appendChild(captionContent);
            figure.appendChild(figcaption);
        }

        this.replaceChildren();
        this.appendChild(figure);
        this.#video = video;

        if (this.hasAttribute("autoplay")) this.#observeAutoplay();
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
    }

    #observeAutoplay(): void {
        const video = this.#video;
        if (!video || typeof IntersectionObserver === "undefined") return;
        this.#observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        try {
                            const played = video.play();
                            if (played && typeof played.then === "function") played.catch(() => {});
                        } catch {
                            // Playback can be rejected by the browser (autoplay
                            // policy) or unimplemented in the test environment;
                            // either way this is not a defect to surface.
                        }
                    } else {
                        try {
                            video.pause();
                        } catch {
                            // See above.
                        }
                    }
                }
            },
            { threshold: 0.5 },
        );
        this.#observer.observe(video);
    }
}
