// Combobox component
//
// A headless combobox: a text input paired with a dropdown listbox of
// suggestions, following the WAI-ARIA combobox (list autocomplete)
// pattern. The custom element stands in for the wrapper div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element; it builds a real
// <input role="combobox"> and a <div role="listbox"> as its own
// children.
//
// lib/combobox-keys.ts owns the keys, typing, blur and pointer, the module
// the catalogs share (components/combobox/AGENTS.md). Filtering the option
// list remains the consumer's responsibility: the consumer supplies and
// updates the option children, and this component navigates and selects
// among whatever is currently present.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label on both the input
//     and the listbox.
//   value — bindable current input text; also a live `value` property.
//   open — presence-based boolean; bindable dropdown visibility. Also a
//     live `open` property.
//   ...rest — spread onto the outer wrapper (the host itself).
//
// The listbox stays in the DOM at all times (toggled via the `hidden`
// content attribute rather than added/removed) — equivalent for both
// the accessibility tree and visual rendering, matching this catalog's
// EditableForm precedent, and it keeps the listbox's id valid for
// aria-controls even while closed.
//
// Consumer's children are option elements (any element carrying
// role="option") moved into the listbox once, at connect time.
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ value: string }>
// when an option is selected (Enter or pointer click).
//
// References:
//   - components/combobox/index.md (canonical contract)
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";
import { attachCombobox, setActiveOption } from "../lib/combobox-keys.js";
import { syncManualPopover } from "./popover.js";

export class Combobox extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "open", "result-count", "results-label", "no-results-label"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #listbox: HTMLDivElement | null = null;
    #listboxId = nextId("lily-combobox-listbox");
    #status: HTMLParagraphElement | null = null;
    #statusTimer: ReturnType<typeof setTimeout> | undefined;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "combobox");

        const listbox = document.createElement("div");
        listbox.id = this.#listboxId;
        listbox.setAttribute("role", "listbox");
        moveChildrenInto(this, listbox);
        this.#listbox = listbox;

        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-autocomplete", "list");
        input.setAttribute("aria-controls", this.#listboxId);
        input.addEventListener("input", () => this.setAttribute("value", input.value));
        this.#input = input;

        this.appendChild(input);
        this.appendChild(listbox);

        // result-count, results-label ("{n} matches") and no-results-label: the count, or "no matches", in the consumer's
        // words, announced politely after typing pauses (status-delay, default 500 ms; P34-T2).
        if (this.hasAttribute("results-label") || this.hasAttribute("no-results-label")) {
            const status = document.createElement("p");
            status.className = "combobox-status";
            status.setAttribute("role", "status");
            this.appendChild(status);
            this.#status = status;
        }

        // Built once and never torn down: the input and list live and die with this element.
        attachCombobox(input, listbox, {
            open: () => this.hasAttribute("open"),
            setOpen: (next) => this.toggleAttribute("open", next),
            choose: (value) => this.#select(value),
        });

        this.#sync();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        this.setAttribute("value", v);
    }

    get open(): boolean {
        return this.hasAttribute("open");
    }

    set open(v: boolean) {
        this.toggleAttribute("open", v);
    }

    #sync(): void {
        if (!this.#built) return;
        const input = this.#input!;
        const listbox = this.#listbox!;

        const status = this.#status;
        if (status) {
            const raw = this.getAttribute("result-count");
            const count = raw === null ? undefined : Number(raw);
            if (count !== undefined) status.dataset.results = String(count);
            const words =
                count === undefined
                    ? ""
                    : count === 0
                      ? (this.getAttribute("no-results-label") ?? "")
                      : (this.getAttribute("results-label") ?? "").replaceAll("{n}", String(count));
            const open = this.hasAttribute("open");
            clearTimeout(this.#statusTimer);
            this.#statusTimer = setTimeout(
                () => (status.textContent = open ? words : ""),
                Number(this.getAttribute("status-delay") ?? "500"),
            );
        }

        const label = this.getAttribute("label");
        if (label !== null) {
            input.setAttribute("aria-label", label);
            listbox.setAttribute("aria-label", label);
        }

        const value = this.getAttribute("value");
        // defaultValue too: a form reset restores an input to its default, so the initial value must be it.
        if (value !== null) input.defaultValue = value;
        if (value !== null && input.value !== value) input.value = value;

        const open = this.hasAttribute("open");
        input.setAttribute("aria-expanded", String(open));
        syncManualPopover(listbox, open);
        if (!open) setActiveOption(input, listbox, null);
    }

    #select(value: string): void {
        this.#input!.value = value;
        this.setAttribute("value", value);
        this.dispatchEvent(
            new CustomEvent("lily-change", {
                detail: { value },
                bubbles: true,
                composed: true,
            }),
        );
    }
}
