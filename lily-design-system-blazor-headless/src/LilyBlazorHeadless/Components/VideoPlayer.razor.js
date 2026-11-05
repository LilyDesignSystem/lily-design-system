// VideoPlayer.razor.js — muted, and play-in-view: plays while at least half of the video is on screen.

export function attach(video, autoplay, muted) {
    video.muted = muted;
    let observer;
    if (autoplay && typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) video.play().catch(() => {});
                    else video.pause();
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(video);
    }
    return {
        dispose() {
            observer?.disconnect();
        },
    };
}
