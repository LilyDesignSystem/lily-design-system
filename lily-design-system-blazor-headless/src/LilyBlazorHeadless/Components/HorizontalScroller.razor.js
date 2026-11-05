// HorizontalScroller.razor.js — the keys of a HorizontalScroller, as in the Svelte component. data-step holds the
// pixels per arrow key, so a re-render with a new Step needs no call.

export function attach(node) {
    const onKeydown = (event) => {
        const step = Number(node.dataset.step);
        if (event.key === "ArrowRight") node.scrollBy({ left: step, behavior: "smooth" });
        else if (event.key === "ArrowLeft") node.scrollBy({ left: -step, behavior: "smooth" });
        else if (event.key === "Home") node.scrollTo({ left: 0, behavior: "smooth" });
        else if (event.key === "End") node.scrollTo({ left: node.scrollWidth, behavior: "smooth" });
        else return;
        event.preventDefault();
    };
    node.addEventListener("keydown", onKeydown);
    return {
        dispose() {
            node.removeEventListener("keydown", onKeydown);
        },
    };
}
