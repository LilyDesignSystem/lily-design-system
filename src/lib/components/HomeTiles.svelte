<!--
  HomeTiles — exactly six tile cards, immediately after the home page hero (spec/homepage). Six divides into 1×6, 2×3, 3×2 and
  6×1, so the grid never leaves a short last row; the column count is set explicitly in style.css (.tile-grid), never by
  auto-fit, which would choose four or five. Each tile is one link: its heading, one description, nothing else focusable.
  The words come from the per-language strings; a language without a tile's words shows the English ones.
-->
<script lang="ts">
    import { HOME_TILES, homeTile, type HomeTile } from "#lib/i18n.js";
    import { pageHref, type PageSlug } from "#lib/pages.js";

    let { locale }: { locale: string } = $props();

    // Where each tile goes. Pages with translations follow the language; the catalogue and the style guide are one route each.
    const TARGET: Record<HomeTile, (locale: string) => string> = {
        tutorials: (l) => pageHref("tutorials", l),
        components: () => "/components/",
        examples: (l) => pageHref("examples", l),
        styles: () => "/en-001/styles/",
        compare: (l) => pageHref("compare" satisfies PageSlug, l),
        accessibility: (l) => pageHref("accessibility" satisfies PageSlug, l),
    };
</script>

<section
    class="section tile-section"
    aria-label="Where to start"
    data-tiles={HOME_TILES.length}
>
    <div class="tile-grid">
        {#each HOME_TILES as tile (tile)}
            {@const words = homeTile(locale, tile)}
            <div
                class="card tile"
                data-tile={tile}
            >
                <h3 class="card-heading">
                    <a
                        class="tile-link"
                        data-lily-card-link
                        href={TARGET[tile](locale)}>{words.heading}</a
                    >
                </h3>
                <p class="card-description">{words.description}</p>
            </div>
        {/each}
    </div>
</section>
