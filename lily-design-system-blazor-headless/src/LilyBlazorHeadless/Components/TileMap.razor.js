// TileMap.razor.js -- keyboard for TileMap.razor.
// Port of lily-design-system-svelte-headless TileMap.svelte. Blazor C# cannot read or
// move DOM focus synchronously, read layout, or cancel only some keys, and the tiles
// are the consumer's ChildContent, so this module (browser APIs only, no styling)
// owns the keys over the focusable [data-tile] children: ArrowRight / ArrowLeft step
// through them in order, stopping at the ends; ArrowDown / ArrowUp go to the nearest
// tile in a lower or higher row, by position on screen; Enter / Space dispatch a
// bubbling "tile-activate" event on the focused tile; Escape blurs it. Tiles are read
// at key time.

export function attach(root) {
    function onkeydown(event) {
        const tiles = Array.from(root.querySelectorAll("[data-tile]"));
        if (tiles.length === 0) return;
        const focused = document.activeElement;
        const index = tiles.indexOf(focused);
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                tiles[Math.min(tiles.length - 1, index + 1)].focus();
                break;
            case "ArrowLeft":
                event.preventDefault();
                tiles[Math.max(0, index - 1)].focus();
                break;
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (index === -1) return;
                const here = focused.getBoundingClientRect();
                const x = here.left + here.width / 2;
                const below = event.key === "ArrowDown";
                const next = tiles
                    .filter((t) => t !== focused)
                    .map((t) => ({ t, r: t.getBoundingClientRect() }))
                    .filter(({ r }) => (below ? r.top > here.top : r.top < here.top))
                    .map(({ t, r }) => ({
                        t,
                        score: Math.abs(r.left + r.width / 2 - x) + Math.abs(r.top - here.top),
                    }))
                    .sort((a, b) => a.score - b.score)[0]?.t;
                next?.focus();
                break;
            }
            case "Enter":
            case " ":
                event.preventDefault();
                focused?.dispatchEvent(new CustomEvent("tile-activate", { bubbles: true }));
                break;
            case "Escape":
                event.preventDefault();
                focused?.blur();
                break;
        }
    }
    root.addEventListener("keydown", onkeydown);
    return {
        dispose() {
            root.removeEventListener("keydown", onkeydown);
        },
    };
}
