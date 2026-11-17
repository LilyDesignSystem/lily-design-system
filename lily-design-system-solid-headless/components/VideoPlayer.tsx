// VideoPlayer component
//
// A <video> player rendered inside a <figure>. Supports auto-play-on-scroll
// via IntersectionObserver: when `autoplay` is true, the video plays when
// scrolled into the viewport and pauses when scrolled out. Native browser
// controls show by default; consumers can pass custom controls overlay
// content via children. The required `label` becomes the figure's
// aria-label so screen readers announce the video story.
//
// Props:
//   class — string, optional. CSS class name.
//   src      — string, required. Video source URL.
//   label    — string, required. Accessible label for the video.
//   poster   — string, optional. Poster image URL.
//   autoplay — boolean, default false. Auto-play when scrolled into view.
//   muted    — boolean, default false.
//   loop     — boolean, default false.
//   controls — boolean, default true. Show native browser controls.
//   caption  — ReactNode, optional. Caption rendered inside <figcaption>.
//   children — ReactNode, optional. Custom controls overlay.
//   ...restProps — additional HTML attributes spread onto the <figure>.
//
// Accessibility:
//   - aria-label on the figure
//   - Native <video controls> exposes pause/play/seek to assistive tech
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Required label and src — the component cannot be silently inaccessible

import type { JSX } from "@solidjs/web";
import { omit, createEffect, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface VideoPlayerProps {
    class?: string;
    /** Video source URL. */
    src: string;
    /** Accessible label for the video. */
    label: string;
    /** Poster image URL. */
    poster?: string;
    /** Auto-play when scrolled into view. */
    autoplay?: boolean;
    /** Muted state. */
    muted?: boolean;
    /** Loop playback. */
    loop?: boolean;
    /** Show native browser controls. */
    controls?: boolean;
    /** Caption rendered inside <figcaption>. */
    caption?: JSX.Element;
    /** Custom controls overlay. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function VideoPlayer(props: VideoPlayerProps) {
    const p = withDefaults(
        { class: "" as const, autoplay: false, muted: false, loop: false, controls: true },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "src",
        "label",
        "poster",
        "autoplay",
        "muted",
        "loop",
        "controls",
        "caption",
        "children",
    );
    warnMissingName("VideoPlayer", p.label, p["aria-label"], p["aria-labelledby"]);
    const videoRef: { current: HTMLVideoElement | null } = { current: null };

    createEffect(
        () => [p.autoplay],
        () =>
            untrack(() => {
                if (!p.autoplay) return;
                const video = videoRef.current;
                if (!video || typeof IntersectionObserver === "undefined") return;
                const observer = new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                void video.play().catch(() => {});
                            } else {
                                video.pause();
                            }
                        }
                    },
                    { threshold: 0.5 },
                );
                observer.observe(video);
                return () => observer.disconnect();
            }),
    );

    return (
        <figure
            class={`video-player ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            <video
                ref={(el) => (videoRef.current = el)}
                class="video-player-element"
                src={p.src}
                poster={p.poster}
                muted={p.muted}
                loop={p.loop}
                controls={p.controls}
                playsinline
            />
            {p.children !== undefined && <div class="video-player-controls">{p.children}</div>}
            {p.caption !== undefined && (
                <figcaption class="video-player-caption">{p.caption}</figcaption>
            )}
        </figure>
    );
}
