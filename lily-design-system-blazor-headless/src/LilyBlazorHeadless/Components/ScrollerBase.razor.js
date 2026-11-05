// ScrollerBase.razor.js — the step at the offset line and the scroll progress, as in the Svelte component. Progress is
// sent at most once a frame, because each send crosses to the server. Inside a ScrollerVideo the video's time follows
// progress here too: a round trip through C# would make it lag behind the scroll.

export function attach(root, dotnet, offset, wantsIndex, wantsProgress) {
    const video = root.closest(".scroller-video")?.querySelector("video") ?? null;
    if (video) video.muted = true;
    const steps = Array.from(root.children);
    const line = `${(offset * 100).toFixed(2)}%`;
    const observer =
        typeof IntersectionObserver === "undefined" || !wantsIndex
            ? null
            : new IntersectionObserver(
                  (entries) => {
                      for (const entry of entries) {
                          const index = steps.indexOf(entry.target);
                          if (entry.isIntersecting && index !== -1) {
                              dotnet.invokeMethodAsync("OnScrollerIndex", index);
                          }
                      }
                  },
                  {
                      rootMargin: `-${line} 0px -${(100 - offset * 100).toFixed(2)}% 0px`,
                      threshold: 0,
                  },
              );
    for (const step of steps) observer?.observe(step);

    let frame = 0;
    let last = -1;
    const measure = () => {
        frame = 0;
        const rect = root.getBoundingClientRect();
        const height = window.innerHeight || 1;
        const progress = Math.max(0, Math.min(1, (height - rect.top) / (rect.height + height)));
        if (progress === last) return;
        last = progress;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = video.duration * progress;
        }
        if (wantsProgress) dotnet.invokeMethodAsync("OnScrollerProgress", progress);
    };
    const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (video) video.addEventListener("loadedmetadata", measure);
    measure();
    return {
        dispose() {
            observer?.disconnect();
            window.removeEventListener("scroll", onScroll);
            if (video) video.removeEventListener("loadedmetadata", measure);
            if (frame) cancelAnimationFrame(frame);
        },
    };
}
