// Command component
//
// A headless command palette: a search region containing a text input
// and a listbox of results. The custom element stands in for the
// wrapper div directly (see lib/dom-utils.applySelfClassName), and
// builds a real <input type="search"> and a <div role="listbox"> as its
// own children.
//
// The canonical contract (components/command/AGENTS.md) documents only
// Tab-focus and leaves arrow-key navigation to the consumer; this
// implementation additionally provides real keyboard navigation among
// the listbox's role="option" children (arrow keys, Home/End,
// aria-activedescendant, Enter to select) per the WAI-ARIA
// Combobox/Listbox patterns it already cites — filtering the result set
// itself remains the consumer's responsibility (the consumer supplies
// and updates the option children based on `value`).
//
// Attributes:
//   label — REQUIRED. Accessible name for the search region, the input,
//     and the listbox, via aria-label.
//   placeholder — optional placeholder text for the search input.
//   value — bindable current search text; also a live `value` property.
//   ...rest — spread onto the outer wrapper (the host itself).
//
// Fires a bubbling, composed "lily-change" CustomEvent<{ value: string }>
// when a result is selected (Enter or pointer click).
//
// References:
//   - components/command/index.md (canonical contract)
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";

export class Command extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "placeholder", "value"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #listbox: HTMLDivElement | null = null;
    #listboxId = nextId("lily-command-listbox");
    #activeId: string | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "command");
        this.setAttribute("role", "search");

        const listbox = document.createElement("div");
        listbox.id = this.#listboxId;
        listbox.setAttribute("role", "listbox");
        moveChildrenInto(this, listbox);
        listbox.addEventListener("click", this.#onOptionClick);
        this.#listbox = listbox;

        const input = document.createElement("input");
        input.type = "search";
        input.autocomplete = "off";
        input.setAttribute("aria-controls", this.#listboxId);
        input.addEventListener("keydown", this.#onKeydown);
        input.addEventListener("input", this.#onInput);
        this.#input = input;

        this.appendChild(input);
        this.appendChild(listbox);

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

    #sync(): void {
        if (!this.#built) return;
        const input = this.#input!;
        const listbox = this.#listbox!;

        const label = this.getAttribute("label");
        if (label !== null) {
            this.setAttribute("aria-label", label);
            input.setAttribute("aria-label", label);
            listbox.setAttribute("aria-label", label);
        }

        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) input.placeholder = placeholder;

        const value = this.getAttribute("value");
        if (value !== null && input.value !== value) input.value = value;
    }

    #options(): HTMLElement[] {
        return Array.from(this.#listbox?.children ?? []).filter(
            (el): el is HTMLElement => el instanceof HTMLElement && el.getAttribute("role") === "option",
        );
    }

    #setActive(option: HTMLElement | null): void {
        for (const opt of this.#options()) opt.removeAttribute("aria-selected");
        if (option) {
            option.setAttribute("aria-selected", "true");
            if (!option.id) option.id = nextId("lily-command-option");
            this.#activeId = option.id;
            this.#input!.setAttribute("aria-activedescendant", option.id);
        } else {
            this.#activeId = null;
            this.#input!.removeAttribute("aria-activedescendant");
        }
    }

    #select(option: HTMLElement): void {
        const text = option.textContent ?? "";
        this.#input!.value = text;
        this.setAttribute("value", text);
        this.dispatchEvent(
            new CustomEvent("lily-change", { detail: { value: text }, bubbles: true, composed: true }),
        );
    }

    #onOptionClick = (event: MouseEvent): void => {
        const option = (event.target as HTMLElement).closest('[role="option"]');
        if (option instanceof HTMLElement) this.#select(option);
    };

    #onInput = (): void => {
        this.setAttribute("value", this.#input!.value);
    };

    #onKeydown = (event: KeyboardEvent): void => {
        const options = this.#options();
        const activeIndex = options.findIndex((o) => o.id === this.#activeId);

        switch (event.key) {
            case "ArrowDown":
                if (options.length === 0) return;
                event.preventDefault();
                this.#setActive(options[Math.min(activeIndex + 1, options.length - 1)]);
                break;
            case "ArrowUp":
                if (options.length === 0) return;
                event.preventDefault();
                this.#setActive(options[Math.max(activeIndex - 1, 0)]);
                break;
            case "Home":
                if (options.length === 0) return;
                event.preventDefault();
                this.#setActive(options[0]);
                break;
            case "End":
                if (options.length === 0) return;
                event.preventDefault();
                this.#setActive(options[options.length - 1]);
                break;
            case "Enter": {
                if (!this.#activeId) return;
                const active = options.find((o) => o.id === this.#activeId);
                if (active) {
                    event.preventDefault();
                    this.#select(active);
                }
                break;
            }
            case "Escape":
                if (this.#activeId) {
                    event.preventDefault();
                    this.#setActive(null);
                }
                break;
            default:
                break;
        }
    };
}
