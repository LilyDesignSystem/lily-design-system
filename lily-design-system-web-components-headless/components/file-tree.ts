// FileTree component
//
// A <ul role="tree"> of consumer-supplied `<li role="treeitem">` items
// (nested `<ul role="group">` for folders) with the WAI-ARIA APG tree
// keyboard model over the VISIBLE items, using a roving tabindex (exactly
// one item has tabindex="0"). Opening and closing is by toggling
// aria-expanded; consumer CSS hides the group of a closed folder. No event
// is dispatched beyond native focus/click.
//
// Attributes:
//   label — REQUIRED. Accessible name for the tree, via aria-label.
//   ...rest — spread onto the <ul>.
//
// Keyboard:
//   ArrowDown / ArrowUp — next / previous visible item (no wrapping).
//   ArrowRight — closed folder: open it; open folder: first child.
//   ArrowLeft — open folder: close it; otherwise: parent folder.
//   Home / End — first / last visible item.
//   * — expand every closed sibling folder at the focused level.
//   Printable characters — typeahead on the item's own text.
//   Enter / Space — activate (click) the focused item.
//
// Authoring note: the tree is a plain <ul> built from the host's children,
// so consumer markup is `<lily-file-tree label="Files"><li role="treeitem">…`.
//
// References:
//   - components/file-tree/index.md (canonical contract)
//   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);
const ITEM = "[role='treeitem']";

export class FileTree extends HTMLElement {
    #ul: HTMLUListElement | null = null;
    #observer: MutationObserver | null = null;
    #buffer = "";
    #bufferTimer: ReturnType<typeof setTimeout> | undefined;

    connectedCallback(): void {
        if (!this.#ul) {
            const ul = document.createElement("ul");
            ul.className = rootClassName(this, "file-tree");
            ul.setAttribute("role", "tree");
            const label = this.getAttribute("label");
            if (label !== null) ul.setAttribute("aria-label", label);
            passThroughAttributes(this, ul, HANDLED);
            ul.addEventListener("keydown", this.#onKeydown);
            ul.addEventListener("focusin", this.#onFocusin);

            moveChildrenInto(this, ul);
            this.appendChild(ul);
            this.#ul = ul;
        }
        this.#normalise();
        this.#observer = new MutationObserver(this.#normalise);
        this.#observer.observe(this.#ul, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["aria-expanded"],
        });
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
        clearTimeout(this.#bufferTimer);
    }

    #allItems(): HTMLElement[] {
        return this.#ul ? Array.from(this.#ul.querySelectorAll<HTMLElement>(ITEM)) : [];
    }

    #parentItem(item: HTMLElement): HTMLElement | null {
        return item.parentElement?.closest<HTMLElement>(ITEM) ?? null;
    }

    #isVisible(item: HTMLElement): boolean {
        let p = this.#parentItem(item);
        while (p) {
            if (p.getAttribute("aria-expanded") === "false") return false;
            p = this.#parentItem(p);
        }
        return true;
    }

    #visibleItems(): HTMLElement[] {
        return this.#allItems().filter((i) => this.#isVisible(i));
    }

    #ownText(item: HTMLElement): string {
        let text = "";
        item.childNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).getAttribute("role") === "group") return;
            text += n.textContent ?? "";
        });
        return text.trim().toLowerCase();
    }

    #setStop(target: HTMLElement | undefined): void {
        for (const item of this.#allItems()) {
            const want = item === target ? "0" : "-1";
            if (item.getAttribute("tabindex") !== want) item.setAttribute("tabindex", want);
        }
    }

    // Keep exactly one tab stop, on a visible item.
    #normalise = (): void => {
        const visible = this.#visibleItems();
        if (visible.length === 0) return;
        const stops = this.#allItems().filter((i) => i.getAttribute("tabindex") === "0");
        if (stops.length === 1 && this.#isVisible(stops[0])) return;
        const keep =
            stops.find((i) => this.#isVisible(i)) ??
            visible.find((i) => i.getAttribute("aria-selected") === "true") ??
            visible[0];
        this.#setStop(keep);
    };

    #onFocusin = (event: FocusEvent): void => {
        const item = (event.target as HTMLElement).closest<HTMLElement>(ITEM);
        if (item && this.#ul?.contains(item)) this.#setStop(item);
    };

    #focusItem(item: HTMLElement | undefined): void {
        if (!item) return;
        this.#setStop(item);
        item.focus();
    }

    #onKeydown = (event: KeyboardEvent): void => {
        const target = event.target as HTMLElement;
        const item = target.closest<HTMLElement>(ITEM);
        if (!item || !this.#ul?.contains(item)) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        const visible = this.#visibleItems();
        const index = visible.indexOf(item);
        const expanded = item.getAttribute("aria-expanded");

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                this.#focusItem(visible[Math.min(index + 1, visible.length - 1)]);
                return;
            case "ArrowUp":
                event.preventDefault();
                this.#focusItem(visible[Math.max(index - 1, 0)]);
                return;
            case "Home":
                event.preventDefault();
                this.#focusItem(visible[0]);
                return;
            case "End":
                event.preventDefault();
                this.#focusItem(visible[visible.length - 1]);
                return;
            case "ArrowRight":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "false") {
                    item.setAttribute("aria-expanded", "true");
                } else if (expanded === "true") {
                    this.#focusItem(item.querySelector<HTMLElement>("[role='group'] [role='treeitem']") ?? undefined);
                }
                return;
            case "ArrowLeft":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "true") {
                    item.setAttribute("aria-expanded", "false");
                } else {
                    this.#focusItem(this.#parentItem(item) ?? undefined);
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
                    if (sibling.getAttribute("role") === "treeitem" && sibling.getAttribute("aria-expanded") === "false") {
                        sibling.setAttribute("aria-expanded", "true");
                    }
                }
                return;
        }

        // Typeahead
        if (event.key.length === 1) {
            event.preventDefault();
            this.#buffer += event.key.toLowerCase();
            clearTimeout(this.#bufferTimer);
            this.#bufferTimer = setTimeout(() => (this.#buffer = ""), 500);
            const buffer = this.#buffer;
            const cycle = buffer.length === 1 || [...buffer].every((c) => c === buffer[0]);
            const needle = cycle ? buffer[0] : buffer;
            const split = index + (cycle ? 1 : 0);
            const ordered = [...visible.slice(split), ...visible.slice(0, split)];
            this.#focusItem(ordered.find((i) => this.#ownText(i).startsWith(needle)));
        }
    };
}
