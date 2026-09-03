// Shared DOM helpers for the Web Components headless catalog.
//
// Every component here is an AUTONOMOUS custom element (no "is=" customized
// built-in) wrapping a real semantic element in light DOM (no shadow root).
// See spec/index.md §3 for why: customized built-ins would let the
// component register directly on the native tag with zero wrapper (exactly
// what Angular's own headless library does via attribute selectors), but
// WebKit has never implemented them and has stated it will not, which rules
// them out for a public library. Autonomous elements always introduce one
// extra host node — an accepted, documented tradeoff, not an oversight.
//
// These helpers keep that tradeoff's mechanics (building the inner element
// once, moving light-DOM children into it, mirroring the host's `class`
// attribute onto it) out of every individual component file.

/**
 * Move every child node from `host` into `target`, in order. Used once per
 * component, in `connectedCallback`, to relocate the consumer's light-DOM
 * children (typed as if they were children of the semantic element) into
 * the real semantic element this component renders.
 */
export function moveChildrenInto(host: Element, target: Element): void {
    while (host.firstChild) target.appendChild(host.firstChild);
}

/**
 * Build the class value for the inner semantic element: the component's
 * own kebab-case base class, followed by whatever the consumer wrote in
 * the HOST element's `class` attribute (e.g. `<lily-button class="cta">`).
 * The host's own `class` attribute is intentionally never styled directly
 * — consumer CSS always targets the semantic element that actually paints,
 * not the inert wrapper around it.
 */
export function rootClassName(host: Element, baseClass: string): string {
    const extra = host.getAttribute("class") ?? "";
    return `${baseClass} ${extra}`.trim();
}

/**
 * For components whose canonical HTML tag is a plain `<div>` (no native
 * behaviour worth preserving as a separate element — e.g. Alert,
 * ContextualHelp, Coachmark), the custom element host stands in for that
 * div directly instead of creating a redundant inner wrapper: it takes the
 * base class itself, and its own light-DOM children are the content,
 * unmoved. This is the ONE exception to "always build an inner semantic
 * element" — every other component here has a real native tag (`<button>`,
 * `<a>`, `<dialog>`, `<fieldset>`, …) that is worth rendering for real.
 */
export function applySelfClassName(host: HTMLElement, baseClass: string): void {
    const extra = host.getAttribute("class") ?? "";
    host.className = `${baseClass} ${extra}`.trim();
}

/**
 * Copy every attribute from `host` to `target` except the ones a component
 * handles itself (already reflected as a semantic attribute/ARIA prop, or
 * `class`, which `rootClassName` handles separately). This is the rest-props
 * spread every other framework's headless component performs; here it runs
 * once, at connect time, since these components have no per-render diffing
 * loop the way a framework component does.
 */
export function passThroughAttributes(
    host: Element,
    target: Element,
    handled: ReadonlySet<string>,
): void {
    for (const attr of Array.from(host.attributes)) {
        if (attr.name === "class" || handled.has(attr.name)) continue;
        target.setAttribute(attr.name, attr.value);
    }
}

/** Parse a boolean-ish attribute the way HTML itself does: presence, not value. */
export function hasBooleanAttr(host: Element, name: string): boolean {
    return host.hasAttribute(name);
}

let uid = 0;
/** Stable per-instance id; SSR-safe (no Math.random / Date.now). */
export function nextId(prefix: string): string {
    uid += 1;
    return `${prefix}-${uid}`;
}
