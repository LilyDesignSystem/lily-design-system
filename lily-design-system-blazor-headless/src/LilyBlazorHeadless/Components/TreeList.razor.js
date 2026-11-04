// TreeList.razor.js -- keyboard for TreeList.razor.
// Port of lily-design-system-svelte-headless TreeList.svelte. Blazor C# cannot read or
// move DOM focus synchronously, and the items are the consumer's ChildContent,
// so this module (browser APIs only, no styling) owns the keys: ArrowDown / ArrowUp
// move focus between the visible [role="treeitem"] items (those inside a collapsed aria-expanded="false" item are skipped), wrapping at the ends; Home / End jump. Items are
// read at key time. ArrowRight and ArrowLeft act only on the item that has focus: moving focus here, and sending a
// `toggle` event to TreeListItem.razor, which owns the expanded state. They are swapped in right-to-left.

import { treeItemKey } from "./Menu.razor.js";

const SELECTOR = "[role='treeitem']";
const KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export function attach(root) {
    function expandKey(event) {
        const item = event.target;
        if (!item.matches?.(SELECTOR) || item !== document.activeElement) return;
        const rtl = item.ownerDocument.defaultView.getComputedStyle(item).direction === "rtl";
        const opening = event.key === (rtl ? "ArrowLeft" : "ArrowRight");
        const expanded = item.getAttribute("aria-expanded");
        const target = opening
            ? expanded === "true" && item.querySelector(SELECTOR)
            : expanded !== "true" && item.parentElement?.closest(SELECTOR);
        if (target) target.focus();
        else if (expanded === (opening ? "false" : "true"))
            item.dispatchEvent(new Event("toggle"));
        else return;
        event.preventDefault();
    }

    function onkeydown(event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") return expandKey(event);
        const items = Array.from(root.querySelectorAll(SELECTOR)).filter(
            (el) => !el.parentElement?.closest("[role='treeitem'][aria-expanded='false']"),
        );
        if (!KEYS.includes(event.key)) return treeItemKey(event, items);
        if (items.length === 0) return;
        const current = items.indexOf(document.activeElement);
        const last = items.length - 1;
        let next;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        else if (event.key === "ArrowDown") next = current >= 0 && current < last ? current + 1 : 0;
        else next = current > 0 ? current - 1 : last;
        event.preventDefault();
        items[next].focus();
    }
    root.addEventListener("keydown", onkeydown);
    return {
        dispose() {
            root.removeEventListener("keydown", onkeydown);
        },
    };
}
