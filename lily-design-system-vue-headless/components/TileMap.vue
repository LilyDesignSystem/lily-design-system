<script setup lang="ts">

    // TileMap component
    //
    // A tile cartogram map: a grid of equal-sized tiles where each tile
    // represents a geographic unit. Headless arrow-key navigation moves
    // focus between tiles whose [data-tile] attribute is present;
    // Enter/Space dispatch a `tile-activate` CustomEvent on the focused
    // tile; Escape blurs the focused tile.
    //
    // Props:
    //   label — string, required. Accessible label describing the map.
    //
    // Slots:
    //   default — tile layer content.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Tile geometry / colour / data binding is the consumer's concern

    import { ref } from "vue";

    defineProps<{
        /** Accessible label describing the map. */
        label: string;
    }>();

    const tileMapEl = ref<HTMLDivElement | null>(null);

    function onKeyDown(event: KeyboardEvent) {
        const root = tileMapEl.value;
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
    }

</script>

<template>
    <!-- TileMap.vue -->
    <div
        ref="tileMapEl"
        class="tile-map"
        role="img"
        :aria-label="label"
        aria-roledescription="tile map"
        @keydown="onKeyDown"
    >
        <slot />
    </div>
</template>
