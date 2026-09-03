// Shared Storybook render helper for this package's plain custom
// elements. `@storybook/web-components-vite` accepts a render function
// returning any DOM Node, so stories build the element imperatively
// rather than pulling in `lit-html` just for a tagged template — this
// package has no runtime dependencies and the story layer shouldn't add
// one either.
export function h(tag: string, attrs: Record<string, string | boolean | undefined> = {}, innerHTML = ""): HTMLElement {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === false || value === undefined) continue;
        el.setAttribute(key, value === true ? "" : value);
    }
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
}
