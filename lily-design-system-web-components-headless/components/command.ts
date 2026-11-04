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

import { attachCommand } from "../lib/command-keys.js";
import { applySelfClassName, moveChildrenInto, nextId } from "../lib/dom-utils.js";

export class Command extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "placeholder", "value"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #listbox: HTMLDivElement | null = null;
    #listboxId = nextId("lily-command-listbox");

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
        input.addEventListener("input", () => this.setAttribute("value", input.value));
        this.#input = input;

        this.appendChild(input);
        this.appendChild(listbox);

        // Built once and never torn down: the input and list live and die with this element.
        attachCommand(input, listbox);

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
        // defaultValue too: a form reset restores an input to its default, so the initial value must be it.
        if (value !== null) input.defaultValue = value;
        if (value !== null && input.value !== value) input.value = value;
    }

    #select(option: HTMLElement): void {
        const text = (option.textContent ?? "").trim();
        this.#input!.value = text;
        this.setAttribute("value", text);
        this.dispatchEvent(
            new CustomEvent("lily-change", {
                detail: { value: text },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #onOptionClick = (event: MouseEvent): void => {
        const option = (event.target as HTMLElement).closest('[role="option"]');
        if (option instanceof HTMLElement) this.#select(option);
    };
}
