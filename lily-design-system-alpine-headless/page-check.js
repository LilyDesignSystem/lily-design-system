// Generated from shared/page-check.js by bin/sync-shared-modules; edit the shared module, never this copy.
/**
 * The page-level twin of dev-warning.ts, for the catalogs with no component code to hook (HTML, Nunjucks, Alpine): run it
 * on a rendered page in development and it reports each interactive element with no accessible name. Dependency-free
 * and never loaded unless a page asks for it. Messages are English on purpose: they are for the developer.
 *
 *     import { checkPage } from "@lilydesignsystem/html-headless/components/page-check.js";
 *     checkPage();
 *
 * `globalThis.lilyWarnings = false` turns it off. Spec: spec/testing/index.md#development-warnings.
 */

const ROLES = [
    "alertdialog",
    "button",
    "checkbox",
    "combobox",
    "dialog",
    "grid",
    "link",
    "listbox",
    "menu",
    "menubar",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "tab",
    "tablist",
    "textbox",
    "tree",
    "treeitem",
];

const INTERACTIVE = [
    "a[href]",
    "button",
    "dialog",
    "select",
    "summary",
    "textarea",
    'input:not([type="hidden"])',
    ...ROLES.map((role) => `[role="${role}"]`),
].join(",");

/** Text a screen reader would read inside an element, skipping what is hidden from it. */
function visibleText(node) {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeType !== 1 || node.getAttribute("aria-hidden") === "true") return "";
    if (node.matches("script, style, template")) return "";
    if (node.matches("img, area")) return node.getAttribute("alt") ?? "";
    if (node.matches("svg"))
        return node.querySelector("title")?.textContent ?? node.getAttribute("aria-label") ?? "";
    if (node.hasAttribute("aria-label")) return node.getAttribute("aria-label");
    return [...node.childNodes].map(visibleText).join("");
}

function hasName(el) {
    const doc = el.ownerDocument;
    const labelledBy = (el.getAttribute("aria-labelledby") ?? "").split(/\s+/).filter(Boolean);
    if (
        labelledBy.some((id) =>
            visibleText(doc.getElementById(id) ?? doc.createTextNode("")).trim(),
        )
    )
        return true;
    if (el.getAttribute("aria-label")?.trim() || el.getAttribute("title")?.trim()) return true;
    if (el.matches('input[type="image"]')) return !!el.getAttribute("alt")?.trim();
    if (el.matches('input[type="submit"], input[type="reset"], input[type="button"]'))
        return !!el.value?.trim() || el.matches('input[type="submit"], input[type="reset"]');
    if (el.labels && [...el.labels].some((label) => visibleText(label).trim())) return true;
    if (
        el.matches(
            "input, select, textarea, dialog, [role=listbox], [role=tablist], [role=tree], [role=menu], [role=menubar], [role=grid], [role=combobox], [role=dialog], [role=alertdialog]",
        )
    )
        return false;
    return !!visibleText(el).trim();
}

/** Each interactive element inside `root` with no accessible name. Hidden and inert content is skipped. */
export function findUnnamed(root = document) {
    return [...root.querySelectorAll(INTERACTIVE)].filter(
        (el) => !el.closest('[aria-hidden="true"], [inert], template') && !hasName(el),
    );
}

/** Warn about each unnamed element, once per check, and return how many there were. */
export function checkPage(root = document) {
    if (globalThis.lilyWarnings === false) return 0;
    const unnamed = findUnnamed(root);
    for (const el of unnamed) {
        const start = el.cloneNode(false).outerHTML;
        console.warn(`[Lily] ${start} has no accessible name (WCAG 4.1.2).`);
    }
    return unnamed.length;
}
