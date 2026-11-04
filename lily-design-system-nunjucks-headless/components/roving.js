// roving.js — focus movement for the tab-bar macro's client. `next` and `prev` move and wrap, Home and End jump, and a
// disabled item is skipped. The menus use menu-keys.js, which adds submenus and type-ahead.

const usable = (root, selector) =>
    [...root.querySelectorAll(selector)].filter(
        (el) => !el.disabled && el.getAttribute("aria-disabled") !== "true",
    );

/** `keys()` returns `{ next, prev }`, read per press, so direction can follow the page. Returns a handle with `dispose()`. */
export function initRoving(root, { selector, keys }) {
    function onKeydown(event) {
        const items = usable(root, selector);
        if (items.length === 0) return;
        const index = items.indexOf(root.ownerDocument.activeElement);
        const go = (item) => {
            event.preventDefault();
            item.focus();
        };
        const { next, prev } = keys();
        if (event.key === next) go(items[(index + 1) % items.length]);
        else if (event.key === prev) go(items[index > 0 ? index - 1 : items.length - 1]);
        else if (event.key === "Home") go(items[0]);
        else if (event.key === "End") go(items[items.length - 1]);
    }

    root.addEventListener("keydown", onKeydown);
    return {
        dispose() {
            root.removeEventListener("keydown", onKeydown);
        },
    };
}

/** The horizontal arrows, swapped in right-to-left. */
export const inlineKeys = (root) =>
    getComputedStyle(root).direction === "rtl"
        ? { next: "ArrowLeft", prev: "ArrowRight" }
        : { next: "ArrowRight", prev: "ArrowLeft" };

export const blockKeys = { next: "ArrowDown", prev: "ArrowUp" };
