// Autosuggest component
//
// A text input that proposes matching options as users type: the WAI-ARIA
// combobox pattern with list autocomplete. The canonical HTML tag is <div>,
// and the custom element stands in for that wrapper div directly (see
// lib/dom-utils.applySelfClassName); a real <input role="combobox"> and a
// <ul role="listbox"> are built as constructed children.
//
// Suggestions are supplied as light-DOM `<li role="option">` children (this
// catalog's native-element idiom for consumer-supplied list data — see
// Select's `<option>` children) rather than a framework `onInput` callback;
// the host's initial children move into the listbox. A `MutationObserver`
// re-scans the listbox whenever the consumer swaps the options, typically in
// a "lily-input" listener, and reopens or closes it to match.
//
// Attributes:
//   label — REQUIRED. Accessible name of the input and the listbox, via aria-label.
//   value — initial input value; also a live `value` property.
//   placeholder — placeholder text for the input.
//   name — form field name of the input.
//
// Fires:
//   "lily-input" — CustomEvent<{ value: string }> on every input change;
//     the consumer recomputes suggestions and updates the option children.
//   "lily-select" — CustomEvent<{ value: string }> when the user chooses a
//     suggestion (Enter or click); the option's data-value (else its text)
//     fills the input.
//
// ARIA:
//   role="combobox" + aria-autocomplete="list" + aria-expanded +
//   aria-controls + aria-activedescendant (only while an option is
//   highlighted) on the input. role="listbox" on the list, hidden while
//   closed; role="option" + aria-selected on each option.
//
// Keyboard:
//   ArrowDown / ArrowUp — open the listbox / move the highlight (wrapping).
//   Alt+ArrowDown — open without moving the highlight. Alt+ArrowUp — close.
//   Home / End — jump to the first / last option (listbox open only).
//   Enter — choose the highlighted option.
//   Escape — close the listbox without choosing.
//   Blur closes; pressing an option keeps focus in the input so a click can choose it.
//
// References:
//   - components/autosuggest/index.md (canonical contract)
//   - WAI-ARIA Combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { applySelfClassName, nextId } from "../lib/dom-utils.js";

export class Autosuggest extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "placeholder", "name"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #list: HTMLUListElement | null = null;
    #observer: MutationObserver | null = null;
    #wanted = false;
    #active = -1;

    connectedCallback(): void {
        if (!this.#built) {
            this.#built = true;
            applySelfClassName(this, "autosuggest");

            const listboxId = nextId("autosuggest-listbox");

            // Capture the host's original children as the initial options.
            const optionChildren = Array.from(this.childNodes);

            const input = document.createElement("input");
            input.className = "autosuggest-input";
            input.type = "text";
            input.autocomplete = "off";
            input.setAttribute("role", "combobox");
            input.setAttribute("aria-autocomplete", "list");
            input.setAttribute("aria-expanded", "false");
            input.setAttribute("aria-controls", listboxId);
            input.defaultValue = this.getAttribute("value") ?? "";
            input.addEventListener("input", this.#onInput);
            input.addEventListener("keydown", this.#onKeydown);
            input.addEventListener("blur", this.#close);

            const list = document.createElement("ul");
            list.className = "autosuggest-list";
            list.id = listboxId;
            list.setAttribute("role", "listbox");
            list.hidden = true;
            list.addEventListener("mousedown", (event) => event.preventDefault());
            list.addEventListener("click", this.#onListClick);
            for (const node of optionChildren) list.appendChild(node);

            this.appendChild(input);
            this.appendChild(list);
            this.#input = input;
            this.#list = list;

            this.#observer = new MutationObserver(this.#render);
            this.#observer.observe(list, { childList: true, subtree: true });
        }
        this.#sync();
        this.#render();
    }

    disconnectedCallback(): void {
        this.#observer?.disconnect();
        this.#observer = null;
    }

    attributeChangedCallback(): void {
        this.#sync();
    }

    #sync(): void {
        if (!this.#built || !this.#input || !this.#list) return;
        const label = this.getAttribute("label");
        if (label !== null) {
            this.#input.setAttribute("aria-label", label);
            this.#list.setAttribute("aria-label", label);
        }
        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) this.#input.placeholder = placeholder;
        const name = this.getAttribute("name");
        if (name !== null) this.#input.name = name;
    }

    #options(): HTMLElement[] {
        return Array.from(this.#list?.querySelectorAll<HTMLElement>("[role='option']") ?? []);
    }

    #isOpen(): boolean {
        return this.#input?.getAttribute("aria-expanded") === "true";
    }

    // Writes the open state, the option ids and the highlight to the DOM.
    #render = (): void => {
        if (!this.#input || !this.#list) return;
        const options = this.#options();
        if (this.#active >= options.length) this.#active = -1;
        const open = this.#wanted && options.length > 0;
        this.#input.setAttribute("aria-expanded", String(open));
        this.#list.hidden = !open;
        options.forEach((option, index) => {
            if (!option.id) option.id = nextId("autosuggest-option");
            option.setAttribute("aria-selected", String(open && index === this.#active));
        });
        const active = open ? options[this.#active] : undefined;
        if (active) this.#input.setAttribute("aria-activedescendant", active.id);
        else this.#input.removeAttribute("aria-activedescendant");
    };

    #onInput = (): void => {
        this.#wanted = true;
        this.#active = -1;
        this.#render();
        this.dispatchEvent(
            new CustomEvent("lily-input", {
                detail: { value: this.#input?.value ?? "" },
                bubbles: true,
                composed: true,
            }),
        );
    };

    #close = (): void => {
        this.#wanted = false;
        this.#active = -1;
        this.#render();
    };

    #choose(option: HTMLElement): void {
        if (!this.#input) return;
        const value = option.getAttribute("data-value") ?? option.textContent?.trim() ?? "";
        this.#input.value = value;
        this.#close();
        this.dispatchEvent(
            new CustomEvent("lily-select", { detail: { value }, bubbles: true, composed: true }),
        );
    }

    #onListClick = (event: MouseEvent): void => {
        const option = (event.target as Element).closest<HTMLElement>("[role='option']");
        if (option && this.#list?.contains(option)) this.#choose(option);
    };

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.isComposing) return; // The key belongs to the IME.
        const options = this.#options();
        const count = options.length;
        const open = this.#isOpen();
        switch (event.key) {
            case "ArrowDown":
                if (count === 0) return;
                if (event.altKey) {
                    if (open) return;
                    this.#wanted = true;
                    break;
                }
                this.#active = open ? (this.#active + 1) % count : 0;
                this.#wanted = true;
                break;
            case "ArrowUp":
                if (event.altKey) {
                    if (!open) return;
                    this.#wanted = false;
                    this.#active = -1;
                    break;
                }
                if (count === 0) return;
                this.#active = open && this.#active > 0 ? this.#active - 1 : count - 1;
                this.#wanted = true;
                break;
            case "Home":
                if (!open) return;
                this.#active = 0;
                break;
            case "End":
                if (!open) return;
                this.#active = count - 1;
                break;
            case "Enter":
                if (!open || this.#active < 0) return;
                event.preventDefault();
                this.#choose(options[this.#active]);
                return;
            case "Escape":
                if (!open) return;
                this.#wanted = false;
                this.#active = -1;
                break;
            default:
                return;
        }
        event.preventDefault();
        this.#render();
    };

    get value(): string {
        return this.#input?.value ?? this.getAttribute("value") ?? "";
    }

    set value(v: string) {
        if (this.#input) this.#input.value = v;
        else this.setAttribute("value", v);
    }
}
