// TileMap component
//
// A tile cartogram map with configurable layers for geographic data
// visualization. Renders a <div role="img">; the custom element stands
// in for that div directly (see lib/dom-utils.applySelfClassName) since
// <div> has no native behaviour worth preserving as a separate element.
// Ported faithfully from the Svelte canonical: headless arrow-key
// navigation between the consumer's `[data-tile]` children, Enter/Space
// dispatches a bubbling "tile-activate" CustomEvent on the focused tile
// (unprefixed, matching every other framework port's event name exactly),
// Escape blurs. The consumer supplies tile positioning/styling/content.
//
// Attributes:
//   label — REQUIRED. Accessible label describing the map, via aria-label.
//
// Keyboard:
//   ArrowRight/ArrowLeft — move focus to the next/previous [data-tile].
//   ArrowDown/ArrowUp — move focus to the nearest tile below/above,
//     scored by horizontal + vertical distance from the current tile.
//   Enter/Space — dispatch "tile-activate" on the focused tile.
//   Escape — blur the focused tile.
//
// References:
//   - components/tile-map/index.md (canonical contract)
//   - Reuters Graphics TileMap component

import { applySelfClassName } from "../lib/dom-utils.js";

export class TileMap extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "tile-map");
        this.setAttribute("role", "img");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        this.setAttribute("aria-roledescription", "tile map");

        this.addEventListener("keydown", this.#onKeydown);
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const tiles = Array.from(this.querySelectorAll<HTMLElement>("[data-tile]"));
        if (tiles.length === 0) return;
        const focused = document.activeElement as HTMLElement | null;
        const idx = focused ? tiles.indexOf(focused) : -1;

        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                tiles[Math.min(tiles.length - 1, idx + 1)]?.focus();
                break;
            case "ArrowLeft":
                event.preventDefault();
                tiles[Math.max(0, idx - 1)]?.focus();
                break;
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (idx === -1) return;
                const current = tiles[idx];
                const currentRect = current.getBoundingClientRect();
                const targetX = currentRect.left + currentRect.width / 2;
                const wantBelow = event.key === "ArrowDown";
                const next = tiles
                    .map((t, i) => ({ t, i }))
                    .filter(({ i }) => i !== idx)
                    .filter(({ t }) => {
                        const r = t.getBoundingClientRect();
                        return wantBelow ? r.top > currentRect.top : r.top < currentRect.top;
                    })
                    .map(({ t }) => {
                        const r = t.getBoundingClientRect();
                        const dx = Math.abs(r.left + r.width / 2 - targetX);
                        const dy = Math.abs(r.top - currentRect.top);
                        return { t, score: dx + dy };
                    })
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
    };
}
