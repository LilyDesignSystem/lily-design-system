// Autosuggest component
//
// A text input that proposes matching options as users type, implementing
// the WAI-ARIA Combobox pattern atop a text <input>. The canonical HTML tag
// is <div>, and the custom element stands in for that wrapper div directly
// (see lib/dom-utils.applySelfClassName): a real <input> and a
// <ul role="listbox"> are built as constructed children.
//
// FLAGGED DEVIATION FROM THE MAJORITY: svelte-headless and react-headless
// both ship this component as a passive stub (a bare aria-labelled div with
// no input, no listbox, no keyboard handling at all) — the AGENTS.md
// contract they claim to implement is not actually built in either
// canonical catalog. Implemented the real, documented WAI-ARIA Combobox
// contract here per this batch's explicit instruction to treat autosuggest
// as a real interactive widget rather than copy the stub majority.
//
// Suggestions are supplied as light-DOM `<li role="option">` children
// (this catalog's native-element idiom for consumer-supplied list data —
// see Select's `<option>` children) rather than a framework `onInput`
// callback. A `MutationObserver` re-scans the listbox whenever the
// consumer adds/removes/edits option children after connect, so
// suggestions can be swapped in response to typing.
//
// Attributes:
//   label — REQUIRED. Accessible name for the combobox, via aria-label.
//   value — initial input value; also a live `value` property.
//   placeholder — placeholder text for the input.
//
// Fires:
//   "lily-input" — CustomEvent<{ value: string }> on every input change;
//     the consumer recomputes suggestions and updates the option children.
//   "lily-select" — CustomEvent<{ value: string }> when the user selects a
//     suggestion (Enter or pointer selection).
//
// ARIA:
//   role="combobox" + aria-haspopup="listbox" + aria-expanded on the host.
//   aria-controls + aria-autocomplete="list" + aria-activedescendant on the
//   input. role="listbox" on the list; role="option" + aria-selected on
//   each option.
//
// Keyboard:
//   ArrowDown — open the listbox / move highlight to the next option.
//   ArrowUp — move highlight to the previous option (listbox open only).
//   Enter — select the highlighted option.
//   Escape — close the listbox without selecting.
//   Home / End — jump to the first / last option (listbox open only).
//
// References:
//   - components/autosuggest/index.md (canonical contract)
//   - WAI-ARIA Combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class Autosuggest extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "placeholder"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #list: HTMLUListElement | null = null;
    #observer: MutationObserver | null = null;
    #activeIndex = -1;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "autosuggest");
            this.setAttribute("role", "combobox");
            this.setAttribute("aria-haspopup", "listbox");
            this.setAttribute("aria-expanded", "false");

            const listboxId = nextId("autosuggest-listbox");

            // Capture the host's original children as the initial options.
            const optionChildren = Array.from(this.childNodes);

            const input = document.createElement("input");
            input.type = "text";
            input.setAttribute("aria-autocomplete", "list");
            input.setAttribute("aria-controls", listboxId);
            input.setAttribute("aria-activedescendant", "");
            input.value = this.getAttribute("value") ?? "";
            input.addEventListener("input", this.#onInput);
            input.addEventListener("keydown", this.#onKeydown);
            input.addEventListener("blur", this.#close);

            const list = document.createElement("ul");
            list.className = "autosuggest-list";
            list.id = listboxId;
            list.setAttribute("role", "listbox");
            list.hidden = true;
            for (const node of optionChildren) list.appendChild(node);

            this.appendChild(input);
            this.appendChild(list);
            this.#input = input;
            this.#list = list;

            this.#observer = new MutationObserver(this.#refreshOptions);
            this.#observer.observe(list, { childList: true });
        }
        this.#refreshOptions();
        this.#sync();
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built || !this.#input) return;
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) this.#input.placeholder = placeholder;
    }

    #options(): HTMLElement[] {
        return Array.from(this.#list?.querySelectorAll<HTMLElement>(":scope > [role='option']") ?? []);
    }

    #refreshOptions = (): void => {
        const options = this.#options();
        for (const option of options) {
            option.setAttribute("role", "option");
            if (!option.id) option.id = nextId("autosuggest-option");
            if (!option.hasAttribute("aria-selected")) option.setAttribute("aria-selected", "false");
            option.addEventListener("mousedown", this.#onOptionMousedown);
        }
        if (this.#activeIndex >= options.length) this.#activeIndex = options.length - 1;
    };

    #onInput = (): void => {
        this.dispatchEvent(
            new CustomEvent("lily-input", {
                detail: { value: this.#input?.value ?? "" },
                bubbles: true,
                composed: true,
            }),
        );
        this.#activeIndex = -1;
        this.#highlight();
    };

    #open(): void {
        if (!this.#list) return;
        this.setAttribute("aria-expanded", "true");
        this.#list.hidden = false;
    }

    #close = (): void => {
        if (!this.#list) return;
        this.setAttribute("aria-expanded", "false");
        this.#list.hidden = true;
        this.#activeIndex = -1;
        this.#highlight();
    };

    #highlight(): void {
        const options = this.#options();
        options.forEach((option, index) => {
            option.setAttribute("aria-selected", index === this.#activeIndex ? "true" : "false");
        });
        const active = options[this.#activeIndex];
        this.#input?.setAttribute("aria-activedescendant", active?.id ?? "");
    }

    #select(index: number): void {
        const options = this.#options();
        const option = options[index];
        if (!option || !this.#input) return;
        const value = option.getAttribute("data-value") ?? option.textContent ?? "";
        this.#input.value = value;
        this.#close();
        this.dispatchEvent(
            new CustomEvent("lily-select", { detail: { value }, bubbles: true, composed: true }),
        );
    }

    #onOptionMousedown = (event: MouseEvent): void => {
        event.preventDefault();
        const options = this.#options();
        const index = options.indexOf(event.currentTarget as HTMLElement);
        if (index >= 0) this.#select(index);
    };

    #onKeydown = (event: KeyboardEvent): void => {
        const options = this.#options();
        const isOpen = this.getAttribute("aria-expanded") === "true";
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                if (!isOpen) {
                    if (options.length === 0) break;
                    this.#open();
                    this.#activeIndex = 0;
                } else {
                    this.#activeIndex = Math.min(this.#activeIndex + 1, options.length - 1);
                }
                this.#highlight();
                break;
            }
            case "ArrowUp": {
                if (!isOpen) break;
                event.preventDefault();
                this.#activeIndex = Math.max(this.#activeIndex - 1, 0);
                this.#highlight();
                break;
            }
            case "Home": {
                if (!isOpen) break;
                event.preventDefault();
                this.#activeIndex = 0;
                this.#highlight();
                break;
            }
            case "End": {
                if (!isOpen) break;
                event.preventDefault();
                this.#activeIndex = options.length - 1;
                this.#highlight();
                break;
            }
            case "Enter": {
                if (!isOpen || this.#activeIndex < 0) break;
                event.preventDefault();
                this.#select(this.#activeIndex);
                break;
            }
            case "Escape": {
                if (!isOpen) break;
                event.preventDefault();
                this.#close();
                break;
            }
        }
    };

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
