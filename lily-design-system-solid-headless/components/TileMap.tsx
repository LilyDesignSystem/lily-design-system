// TileMap component
//
// A tile cartogram map: a grid of equal-sized tiles where each tile
// represents a geographic unit (state, country, region) so all units have
// equal visual weight regardless of their physical size. The component is a
// structural wrapper — the consumer provides tile positioning, colour, and
// content as children. Headless arrow-key navigation moves focus between
// tiles whose `[data-tile]` attribute is present; Enter / Space dispatch a
// `tile-activate` CustomEvent on the focused tile; Escape blurs the focused
// tile.
//
// Props:
//   class — string, optional. CSS class name.
//   label    — string, required. Accessible label describing the map.
//   children — ReactNode, required. Tile layer content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Accessibility:
//   - role="img" + aria-label + aria-roledescription="tile map" on the wrapper
//   - Tiles must be focusable (tabindex=0 or -1) for arrow-key nav to find them
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Tile geometry / colour / data binding is the consumer's concern

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { warnMissingName } from "./dev-warning";

export interface TileMapProps {
    class?: string;
    /** Accessible label describing the map. */
    label: string;
    /** Tile layer content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function TileMap(props: TileMapProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("TileMap", p.label, p["aria-label"], p["aria-labelledby"]);
    const ref: { current: HTMLDivElement | null } = { current: null };

    const handleKeyDown = (event: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
        const root = ref.current;
        if (!root) return;
        const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
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
                const candidates = tiles.map((t, i) => ({ t, i })).filter(({ i }) => i !== idx);
                const wantBelow = event.key === "ArrowDown";
                const next = candidates
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

    return (
        <div
            ref={(el) => (ref.current = el)}
            class={`tile-map ${p.class}`}
            role="img"
            aria-label={p.label}
            aria-roledescription="tile map"
            onKeyDown={handleKeyDown}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
