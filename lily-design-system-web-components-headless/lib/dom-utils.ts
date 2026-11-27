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
/**
 * Bring a built root in step with its host's label and class (tasks.md P50-T28): the class list, and aria-label from label (gone
 * when label is). For an element whose only attribute of its own is label; nothing happens before the root is built.
 */
export function followLabel(
    host: HTMLElement,
    selector: string,
    baseClass: string,
    labelled?: string,
): void {
    const root = host.querySelector(`:scope > ${selector}`);
    if (!root) return;
    root.className = rootClassName(host, baseClass);
    // A chart names its graphic, not its figure: labelled selects the element inside the root that carries the name.
    const target = labelled ? root.querySelector(`:scope > ${labelled}`) : root;
    if (!target) return;
    const label = host.getAttribute("label");
    if (label !== null) target.setAttribute("aria-label", label);
    else target.removeAttribute("aria-label");
}

/**
 * Bring a built native input in step with its host (tasks.md P50-T28): class, aria-label from label, required, disabled, and the
 * value attribute as the input's default. Setting the default is what a native input's value attribute does: it changes what is
 * shown only until the person types, so a change never overwrites their input.
 */
export function followInput(
    host: HTMLElement,
    input: HTMLInputElement,
    baseClass: string,
    options: { range?: boolean } = {},
): void {
    input.className = rootClassName(host, baseClass);
    const label = host.getAttribute("label");
    if (label !== null) input.setAttribute("aria-label", label);
    else input.removeAttribute("aria-label");
    input.defaultValue = host.getAttribute("value") ?? "";
    input.required = host.hasAttribute("required");
    input.disabled = host.hasAttribute("disabled");
    // Only an element that takes min and max as its own follows them; elsewhere they pass through once, as any attribute does.
    if (options.range)
        for (const name of ["min", "max"]) {
            const value = host.getAttribute(name);
            if (value !== null) input.setAttribute(name, value);
            else input.removeAttribute(name);
        }
}

/** Bring a built link in step with its host (tasks.md P50-T28): class, href, and aria-label from label. */
export function followLink(host: HTMLElement, selector: string, baseClass: string): void {
    const a = host.querySelector<HTMLAnchorElement>(`:scope > ${selector}`);
    if (!a) return;
    a.className = rootClassName(host, baseClass);
    for (const [from, to] of [
        ["href", "href"],
        ["label", "aria-label"],
    ]) {
        const value = host.getAttribute(from);
        if (value !== null) a.setAttribute(to, value);
        else a.removeAttribute(to);
    }
}

/**
 * Bring a built radio or checkbox in step with its host (tasks.md P50-T28): class, aria-label from label, name, value, disabled,
 * and checked as the default, so a change follows a form reset's rule and never unticks what the person ticked.
 */
export function followChoice(host: HTMLElement, selector: string, baseClass: string): void {
    const input = host.querySelector<HTMLInputElement>(`:scope > ${selector}`);
    if (!input) return;
    input.className = rootClassName(host, baseClass);
    for (const [from, to] of [
        ["label", "aria-label"],
        ["name", "name"],
        ["value", "value"],
    ]) {
        const value = host.getAttribute(from);
        if (value !== null) input.setAttribute(to, value);
        else if (from !== "value") input.removeAttribute(to);
    }
    input.defaultChecked = host.hasAttribute("checked");
    input.disabled = host.hasAttribute("disabled");
}

/**
 * For an element that is its own root (tasks.md P50-T28): keep its base class when class changes, and aria-label in step with
 * label. role is the role the element takes on when it is named, added if a label comes later; it is never removed.
 */
export function followSelf(
    host: HTMLElement,
    baseClass: string,
    name: string,
    role?: string,
): void {
    if (name === "class") {
        if (!host.classList.contains(baseClass)) applySelfClassName(host, baseClass);
        return;
    }
    if (name !== "label") return;
    const label = host.getAttribute("label");
    if (label === null) {
        host.removeAttribute("aria-label");
        return;
    }
    host.setAttribute("aria-label", label);
    if (role && !host.hasAttribute("role")) host.setAttribute("role", role);
}

export function applySelfClassName(host: HTMLElement, baseClass: string): void {
    // The base class is dropped from what the host already has, so applying it again, after a change, never repeats it.
    const extra = (host.getAttribute("class") ?? "")
        .split(/\s+/)
        .filter((token) => token && token !== baseClass)
        .join(" ");
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
    // An id names one element. On a labelable control it must be the control's, so that <label for> and
    // aria-labelledby reach it: move it off the host rather than leave two elements with the same id (P38-T3).
    if (!handled.has("id") && host.hasAttribute("id") && LABELABLE.has(target.localName))
        host.removeAttribute("id");
}

/** The elements a <label> can label (HTML's labelable elements, less the form-associated custom elements). */
export const LABELABLE: ReadonlySet<string> = new Set([
    "button",
    "input",
    "meter",
    "output",
    "progress",
    "select",
    "textarea",
]);

/** The control a <label for> should point at: `el` itself if labelable, else its first labelable descendant. */
export function labelableControl(el: Element): Element | null {
    if (LABELABLE.has(el.localName)) return el;
    return el.querySelector(
        "button, input:not([type=hidden]), meter, output, progress, select, textarea",
    );
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
