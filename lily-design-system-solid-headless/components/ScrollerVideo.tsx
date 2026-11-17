// ScrollerVideo component
//
// A scrollytelling component where the user's scroll position drives the
// playback time of a muted <video>. As the user scrolls down through the
// scroller, currentTime advances proportionally; scrolling back up reverses
// it. Foreground children scroll over the sticky video the same way Scroller
// works.
//
// Why muted: scroll-driven scrubbing produces erratic timing that conflicts
// with the user expectation of audio. The <video> is also preload=auto so
// frames are seekable as soon as the user reaches the scroller; consumers
// who care about bandwidth can override via restProps.
//
// Props:
//   class — string, optional. CSS class name.
//   src      — string, required. Video source URL.
//   label    — string, required. Accessible label for the video story.
//   alt      — string, required. Text alternative describing the video content.
//   offset   — number, default 0.5. Step trigger position in the viewport.
//   onIndexChange    — callback, optional.
//   onProgressChange — callback, optional. Receives 0..1 and is also used
//                      internally to drive video.currentTime.
//   children — ReactNode, required. Foreground step content overlaid on video.
//   ...restProps — additional HTML attributes spread onto the wrapper.
//
// Accessibility:
//   - aria-label on the wrapper
//   - role="img" + aria-roledescription="scrollable video" + alt on the video
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Position: sticky on the video region is the consumer's CSS responsibility

import type { JSX } from "@solidjs/web";
import { merge, omit, onSettled, untrack } from "solid-js";
import ScrollerBase from "./ScrollerBase";
import { warnMissingName } from "./dev-warning";

export interface ScrollerVideoProps {
    class?: string;
    /** Video source URL. */
    src: string;
    /** Accessible label describing the video story. */
    label: string;
    /** Text alternative describing the video content. */
    alt: string;
    /** Step trigger position in the viewport (0..1). */
    offset?: number;
    /** Fired when the active step index changes. */
    onIndexChange?: (index: number) => void;
    /** Fired with overall scroll progress (0..1). */
    onProgressChange?: (progress: number) => void;
    /** Foreground step content overlaid on the video. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ScrollerVideo(props: ScrollerVideoProps) {
    const p = merge({ class: "" as const, offset: 0.5 }, props);
    const restProps = omit(
        p,
        "class",
        "src",
        "label",
        "alt",
        "offset",
        "onIndexChange",
        "onProgressChange",
        "children",
    );
    warnMissingName("ScrollerVideo", p.label, p["aria-label"], p["aria-labelledby"]);
    const videoRef: { current: HTMLVideoElement | null } = { current: null };

    const handleProgress = (progress: number) => {
        const video = videoRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = video.duration * progress;
        }
        p.onProgressChange?.(progress);
    };

    onSettled(() =>
        untrack(() => {
            const video = videoRef.current;
            if (video) {
                video.muted = true;
                video.playsInline = true;
            }
        }),
    );

    return (
        <div
            class={`scroller-video ${p.class}`}
            role={p.label ? "group" : undefined}
            aria-label={p.label}
            {...restProps}
        >
            <div
                class="scroller-video-background"
                role="img"
                aria-roledescription="scrollable video"
                aria-label={p.alt}
            >
                <video
                    ref={(el) => (videoRef.current = el)}
                    class="scroller-video-element"
                    src={p.src}
                    muted
                    playsinline
                    preload="auto"
                />
            </div>
            <ScrollerBase
                class="scroller-video-foreground"
                offset={p.offset}
                onIndexChange={p.onIndexChange}
                onProgressChange={handleProgress}
            >
                {p.children}
            </ScrollerBase>
        </div>
    );
}
