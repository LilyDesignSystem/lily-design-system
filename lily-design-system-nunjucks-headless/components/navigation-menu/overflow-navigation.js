// Generated from shared/overflow-navigation.ts by bin/sync-shared-modules; edit the shared module, never this copy.
/**
 * Overflow navigation: measure which items of a navigation list fit on one row and move the rest into a "More" disclosure.
 * Framework-neutral and dependency-free; the component renders the markup, this module only moves nodes and toggles state.
 *
 * Expected markup (rendered by every NavigationMenu in `overflow` mode, nothing here creates it):
 *
 *   <nav class="navigation-menu" data-overflow="true">
 *     <ul class="navigation-menu-list">
 *       <li>…item…</li> …
 *       <li class="navigation-menu-more" hidden>
 *         <button class="navigation-menu-more-button" type="button" aria-expanded="false">{moreLabel}</button>
 *         <ul class="navigation-menu-more-list" hidden></ul>
 *       </li>
 *     </ul>
 *   </nav>
 *
 * Progressive enhancement: without this script the More item stays `hidden` and the list wraps (consumer CSS: flex-wrap).
 * With it, a ResizeObserver on the list (never a window `resize` listener) re-measures; the items that do not fit, in order,
 * are appended to the More list, and moved back, in order, when room returns. The opened More list stays in normal flow, so it
 * pushes the content below it down and never covers it (WCAG 2.4.11). Escape closes it and returns focus to the button, and a
 * click outside closes it. Items keep their links and `aria-current`; the module reads and writes no text.
 */

/** How many of `widths` fit in `available` on one row, in the unit the widths use. Pure.
 *  If all fit, returns widths.length. Otherwise the most that fit beside the More item (`moreWidth`). `gap` separates items. */
export function fitCount(widths          , available        , moreWidth        , gap = 0)         {
    const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, widths.length - 1);
    if (total <= available) return widths.length;
    let used = moreWidth;
    let count = 0;
    for (const w of widths) {
        if (used + w + gap > available) break;
        used += w + gap;
        count += 1;
    }
    return count;
}

let counter = 0;

/** Attach overflow behaviour to a `.navigation-menu` root. Returns null when the expected markup is missing. */
export function setupOverflowNavigation(root             )                            {
    const list = root.querySelector             (".navigation-menu-list");
    const more = list?.querySelector             (":scope > .navigation-menu-more") ?? null;
    const button =
        more?.querySelector             (":scope > .navigation-menu-more-button") ?? null;
    const moreList =
        more?.querySelector             (":scope > .navigation-menu-more-list") ?? null;
    if (!list || !more || !button || !moreList) return null;
    const doc = root.ownerDocument;

    if (!moreList.id) moreList.id = `navigation-menu-more-list-${++counter}`;
    button.setAttribute("aria-controls", moreList.id);
    if (!button.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "false");

    let lastAvailable = -1;
    let lastCount = -1;

    const setOpen = (open         , refocus = false)       => {
        moreList.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        if (!open && refocus) button.focus();
    };
    const items = ()                => [
        ...(Array.from(list.children)                 ).filter((c) => c !== more),
        ...(Array.from(moreList.children)                 ),
    ];

    const update = ()       => {
        const available = list.clientWidth;
        const all = items();
        if (available === lastAvailable && all.length === lastCount) return;
        lastAvailable = available;
        lastCount = all.length;

        const active = doc.activeElement;
        // Put everything back in order so each item can be measured where it sits on the row.
        for (const item of all) list.insertBefore(item, more);
        more.hidden = true;
        const gap =
            parseFloat(root.ownerDocument.defaultView?.getComputedStyle(list).columnGap ?? "") || 0;
        const widths = all.map((item) => item.offsetWidth);
        let count = fitCount(widths, available, 0, gap);
        if (count < all.length) {
            more.hidden = false;
            count = fitCount(widths, available, more.offsetWidth, gap);
        }
        for (const item of all.slice(count)) moreList.appendChild(item);
        if (count >= all.length) {
            more.hidden = true;
            setOpen(false);
        }
        if (
            active instanceof HTMLElement &&
            active !== doc.body &&
            doc.contains(active) &&
            doc.activeElement !== active
        ) {
            active.focus();
        }
    };

    const onClick = ()       => setOpen(Boolean(moreList.hidden));
    const onKeydown = (event               )       => {
        if (event.key === "Escape" && !moreList.hidden) {
            event.stopPropagation();
            setOpen(false, true);
        }
    };
    const onOutside = (event       )       => {
        if (!moreList.hidden && event.target instanceof Node && !more.contains(event.target))
            setOpen(false);
    };

    button.addEventListener("click", onClick);
    more.addEventListener("keydown", onKeydown);
    doc.addEventListener("click", onOutside);
    let observer                        = null;
    if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => update());
        observer.observe(list);
    }
    update();

    return {
        update,
        dispose()       {
            observer?.disconnect();
            button.removeEventListener("click", onClick);
            more.removeEventListener("keydown", onKeydown);
            doc.removeEventListener("click", onOutside);
            for (const item of Array.from(moreList.children)) list.insertBefore(item, more);
            more.hidden = true;
            setOpen(false);
        },
    };
}

/** The name the Blazor JS-interop module and the HTML snippet call. */
export const attach = setupOverflowNavigation;
