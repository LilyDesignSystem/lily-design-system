// Visible.razor.js — tells .NET when the element comes on or goes off screen. C# cannot observe the layout.

export function attach(node, dotnet, once, threshold, rootMargin) {
    if (typeof IntersectionObserver === "undefined") return { dispose() {} };
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                dotnet.invokeMethodAsync("OnVisibleChange", entry.isIntersecting);
                if (once && entry.isIntersecting) observer.disconnect();
            }
        },
        { threshold, rootMargin },
    );
    observer.observe(node);
    return {
        dispose() {
            observer.disconnect();
        },
    };
}
