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
//   className — string, optional. CSS class name.
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

import React, { useEffect, useRef } from "react";

export interface VideoPlayerProps {
    className?: string;
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
    caption?: React.ReactNode;
    /** Custom controls overlay. */
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function VideoPlayer({
    className = "",
    src,
    label,
    poster = undefined,
    autoplay = false,
    muted = false,
    loop = false,
    controls = true,
    caption = undefined,
    children,
    ...restProps
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!autoplay) return;
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
            { threshold: 0.5 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, [autoplay]);

    return (
        <figure
            className={`video-player ${className}`}
            aria-label={label}
            {...restProps}
        >
            <video
                ref={videoRef}
                className="video-player-element"
                src={src}
                poster={poster}
                muted={muted}
                loop={loop}
                controls={controls}
                playsInline
            />
            {children !== undefined && (
                <div className="video-player-controls">{children}</div>
            )}
            {caption !== undefined && (
                <figcaption className="video-player-caption">{caption}</figcaption>
            )}
        </figure>
    );
}
