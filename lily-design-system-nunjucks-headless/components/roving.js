// roving.js — keyboard movement between the items of a Nunjucks widget: tab-bar, menu and menu-bar. The macros are
// markup only; this plain ES module is what their client files share.
//
// `next` and `prev` move and wrap, Home and End jump, and with `typeahead` a printable character jumps to the next item
// that starts with it, so a repeated letter cycles. With `rove`, the widget is one tab stop that follows focus. A
// disabled item is skipped.

const usable = (root, selector) =>
    [...root.querySelectorAll(selector)].filter(
        (el) => !el.disabled && el.getAttribute("aria-disabled") !== "true",
    );

/** `keys()` returns `{ next, prev }`, read per press, so direction can follow the page. Returns a handle with `dispose()`. */
export function initRoving(root, { selector, keys, rove = false, typeahead = false }) {
    const tabStop = (item) => {
        for (const el of root.querySelectorAll(selector)) el.tabIndex = el === item ? 0 : -1;
    };

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
        else if (typeahead && event.key.length === 1 && event.key !== " ") {
            if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
            const letter = event.key.toLocaleLowerCase();
            const order = [...items.slice(index + 1), ...items.slice(0, index + 1)];
            const match = order.find((el) =>
                (el.textContent ?? "").trim().toLocaleLowerCase().startsWith(letter),
            );
            if (match) go(match);
        }
    }
    function onFocusin(event) {
        const item = event.target.closest(selector);
        if (item) tabStop(item);
    }

    root.addEventListener("keydown", onKeydown);
    if (rove) {
        root.addEventListener("focusin", onFocusin);
        if (!root.querySelector(`${selector}[tabindex='0']`)) {
            const first = usable(root, selector)[0];
            if (first) tabStop(first);
        }
    }
    return {
        dispose() {
            root.removeEventListener("keydown", onKeydown);
            root.removeEventListener("focusin", onFocusin);
        },
    };
}

/** The horizontal arrows, swapped in right-to-left. */
export const inlineKeys = (root) =>
    getComputedStyle(root).direction === "rtl"
        ? { next: "ArrowLeft", prev: "ArrowRight" }
        : { next: "ArrowRight", prev: "ArrowLeft" };

export const blockKeys = { next: "ArrowDown", prev: "ArrowUp" };
