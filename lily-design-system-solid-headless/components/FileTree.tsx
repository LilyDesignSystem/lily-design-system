// FileTree component
//
// A headless WAI-ARIA tree (APG Tree View) for file/folder hierarchies. The
// consumer supplies <li role="treeitem"> descendants (folders carry
// aria-expanded and a nested <ul role="group">); the root owns the keyboard
// model over the treeitems using a ROVING TABINDEX (exactly one item has
// tabindex=0).
//
// Props:
//   class -- string, optional. CSS class name.
//   label -- string, required. Accessible name via aria-label.
//   children -- ReactNode. Tree items.
//   ...restProps -- spread onto the root <ul>.
//
// Keyboard:
//   ArrowDown / ArrowUp -- next / previous visible item
//   ArrowRight -- closed folder opens; open folder moves to first child
//   ArrowLeft -- open folder closes; otherwise moves to parent
//   Home / End -- first / last visible item
//   * -- expands all closed sibling folders at the focused level
//   printable characters -- typeahead on the item's own text
//   Enter / Space -- activate (click) the focused item
//
// React note (deviation, same behaviour): open/close and the roving tabindex
// are applied to the consumer's rendered DOM nodes (setAttribute), exactly as
// the Svelte canonical does; React does not reconcile attributes it does not
// own. A consumer that wants to observe/own folder state should render
// aria-expanded itself and listen for changes with its own MutationObserver
// or click handlers; if it re-renders aria-expanded with a different value,
// its value wins on that render.

import type { JSX } from "@solidjs/web";
import { omit, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface FileTreeProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Tree item elements. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function FileTree(props: FileTreeProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("FileTree", p.label, p["aria-label"], p["aria-labelledby"]);
    const treeRef: { current: HTMLUListElement | null } = { current: null };
    const buffer = { current: "" };
    const bufferTimer: { current: ReturnType<typeof setTimeout> | undefined } = {
        current: undefined,
    };

    const allItems = (): HTMLElement[] =>
        treeRef.current
            ? Array.from(treeRef.current.querySelectorAll<HTMLElement>("[role='treeitem']"))
            : [];

    const parentItem = (item: HTMLElement): HTMLElement | null =>
        item.parentElement?.closest<HTMLElement>("[role='treeitem']") ?? null;

    const isVisible = (item: HTMLElement): boolean => {
        let p = parentItem(item);
        while (p) {
            if (p.getAttribute("aria-expanded") === "false") return false;
            p = parentItem(p);
        }
        return true;
    };

    const visibleItems = () => allItems().filter(isVisible);

    const ownText = (item: HTMLElement): string => {
        let text = "";
        item.childNodes.forEach((n) => {
            if (
                n.nodeType === Node.ELEMENT_NODE &&
                (n as HTMLElement).getAttribute("role") === "group"
            )
                return;
            text += n.textContent ?? "";
        });
        return text.trim().toLowerCase();
    };

    const setStop = (target: HTMLElement | undefined) => {
        for (const item of allItems()) {
            item.setAttribute("tabindex", item === target ? "0" : "-1");
        }
    };

    const normalise = () => {
        const visible = visibleItems();
        if (visible.length === 0) return;
        const stops = allItems().filter((i) => i.getAttribute("tabindex") === "0");
        if (stops.length === 1 && isVisible(stops[0])) return;
        const keep =
            stops.find(isVisible) ??
            visible.find((i) => i.getAttribute("aria-selected") === "true") ??
            visible[0];
        setStop(keep);
    };

    onSettled(() =>
        untrack(() => {
            const tree = treeRef.current;
            if (!tree) return;
            normalise();
            const observer = new MutationObserver(normalise);
            observer.observe(tree, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["aria-expanded"],
            });
            return () => {
                observer.disconnect();
                clearTimeout(bufferTimer.current);
            };
        }),
    );

    // Re-normalise after any React re-render (p.children may have changed).
    onSettled(() =>
        untrack(() => {
            normalise();
        }),
    );

    const focusItem = (item: HTMLElement | undefined) => {
        if (!item) return;
        setStop(item);
        item.focus();
    };

    const onFocus = (event: FocusEvent & { currentTarget: HTMLUListElement }) => {
        const item = (event.target as HTMLElement).closest<HTMLElement>("[role='treeitem']");
        if (item && treeRef.current?.contains(item)) setStop(item);
    };

    const onKeyDown = (event: KeyboardEvent & { currentTarget: HTMLUListElement }) => {
        const target = event.target as HTMLElement;
        const item = target.closest<HTMLElement>("[role='treeitem']");
        if (!item || !treeRef.current?.contains(item)) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        const visible = visibleItems();
        const index = visible.indexOf(item);
        const expanded = item.getAttribute("aria-expanded");

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                focusItem(visible[Math.min(index + 1, visible.length - 1)]);
                return;
            case "ArrowUp":
                event.preventDefault();
                focusItem(visible[Math.max(index - 1, 0)]);
                return;
            case "Home":
                event.preventDefault();
                focusItem(visible[0]);
                return;
            case "End":
                event.preventDefault();
                focusItem(visible[visible.length - 1]);
                return;
            case "ArrowRight":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "false") {
                    item.setAttribute("aria-expanded", "true");
                } else if (expanded === "true") {
                    focusItem(
                        item.querySelector<HTMLElement>("[role='group'] [role='treeitem']") ??
                            undefined,
                    );
                }
                return;
            case "ArrowLeft":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "true") {
                    item.setAttribute("aria-expanded", "false");
                } else {
                    focusItem(parentItem(item) ?? undefined);
                }
                return;
            case "Enter":
            case " ":
                if (target !== item) return;
                event.preventDefault();
                item.click();
                return;
            case "*":
                event.preventDefault();
                for (const sibling of Array.from(item.parentElement?.children ?? [])) {
                    if (
                        sibling.getAttribute("role") === "treeitem" &&
                        sibling.getAttribute("aria-expanded") === "false"
                    ) {
                        sibling.setAttribute("aria-expanded", "true");
                    }
                }
                return;
        }

        // Typeahead
        if (event.key.length === 1) {
            event.preventDefault();
            buffer.current += event.key.toLowerCase();
            clearTimeout(bufferTimer.current);
            bufferTimer.current = setTimeout(() => (buffer.current = ""), 500);
            const buf = buffer.current;
            const cycle = buf.length === 1 || [...buf].every((c) => c === buf[0]);
            const needle = cycle ? buf[0] : buf;
            const at = index + (cycle ? 1 : 0);
            const ordered = [...visible.slice(at), ...visible.slice(0, at)];
            focusItem(ordered.find((i) => ownText(i).startsWith(needle)));
        }
    };

    return (
        <ul
            class={`file-tree ${p.class}`}
            role="tree"
            aria-label={p.label}
            ref={(el) => (treeRef.current = el)}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            {...restProps}
        >
            {p.children}
        </ul>
    );
}
