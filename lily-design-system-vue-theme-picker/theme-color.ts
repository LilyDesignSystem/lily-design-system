// Keeps <meta name="theme-color"> in step with the applied theme's brand colour (spec/visual-identity, P21-T7).
// Pure and framework-neutral. The colour is the root's computed `--lily-brand`, the decorative identity colour every
// theme defines; there is no colour table here and nothing is guessed when a theme sets none.

/** The value `--lily-brand` resolves to on `root`, or "" when it is unset. */
export function brandColor(root: HTMLElement = document.documentElement): string {
    return getComputedStyle(root).getPropertyValue("--lily-brand").trim();
}

/**
 * Sets `<meta name="theme-color">` to the brand colour, creating the tag when it is missing. Idempotent: an unchanged
 * value writes nothing, and a theme with no `--lily-brand` leaves the tag as it was. Returns true when it wrote.
 */
export function applyThemeColor(root: HTMLElement = document.documentElement): boolean {
    const color = brandColor(root);
    if (!color) return false;
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
    }
    if (meta.content === color) return false;
    meta.content = color;
    return true;
}

/**
 * Applies the theme colour once the managed stylesheet has loaded, because the new theme's custom properties exist only
 * then. Call it right after changing the link's `href`; a link that fails to load leaves the tag unchanged.
 */
export function applyThemeColorWhenLoaded(link: HTMLLinkElement, root: HTMLElement = document.documentElement): void {
    link.addEventListener("load", () => applyThemeColor(root), { once: true });
}
