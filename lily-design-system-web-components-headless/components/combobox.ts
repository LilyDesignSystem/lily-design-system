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
// The canonical contract (components/combobox/AGENTS.md) documents only
// Escape-closes; this implementation additionally provides real
// WAI-ARIA combobox keyboard behaviour (arrow navigation, typeahead,
// aria-activedescendant) per the WAI-ARIA Combobox Pattern reference it
// already cites — filtering the option list itself remains the
// consumer's responsibility (the consumer supplies/updates the option
// children; this component only navigates and selects among whatever is
// currently present).
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

export class Combobox extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "open"];
    }

    #built = false;
    #input: HTMLInputElement | null = null;
    #listbox: HTMLDivElement | null = null;
    #listboxId = nextId("lily-combobox-listbox");
    #activeId: string | null = null;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "combobox");

        const listbox = document.createElement("div");
        listbox.id = this.#listboxId;
        listbox.setAttribute("role", "listbox");
        moveChildrenInto(this, listbox);
        listbox.addEventListener("click", this.#onOptionClick);
        this.#listbox = listbox;

        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-autocomplete", "list");
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

        const label = this.getAttribute("label");
        if (label !== null) {
            input.setAttribute("aria-label", label);
            listbox.setAttribute("aria-label", label);
        }

        const value = this.getAttribute("value");
        if (value !== null && input.value !== value) input.value = value;

        const open = this.hasAttribute("open");
        input.setAttribute("aria-expanded", String(open));
        listbox.hidden = !open;
        if (!open) this.#setActive(null);
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
            if (!option.id) option.id = nextId("lily-combobox-option");
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
        this.removeAttribute("open");
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
        if (!this.hasAttribute("open")) this.setAttribute("open", "");
        const query = this.#input!.value.toLowerCase();
        if (!query) {
            this.#setActive(null);
            return;
        }
        const match = this.#options().find((opt) => (opt.textContent ?? "").toLowerCase().startsWith(query));
        this.#setActive(match ?? null);
    };

    #onKeydown = (event: KeyboardEvent): void => {
        const options = this.#options();
        const activeIndex = options.findIndex((o) => o.id === this.#activeId);

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                if (!this.hasAttribute("open")) {
                    this.setAttribute("open", "");
                    return;
                }
                if (options.length === 0) return;
                this.#setActive(options[Math.min(activeIndex + 1, options.length - 1)]);
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                if (options.length === 0) return;
                this.#setActive(options[Math.max(activeIndex - 1, 0)]);
                break;
            }
            case "Home":
                if (this.hasAttribute("open") && options.length) {
                    event.preventDefault();
                    this.#setActive(options[0]);
                }
                break;
            case "End":
                if (this.hasAttribute("open") && options.length) {
                    event.preventDefault();
                    this.#setActive(options[options.length - 1]);
                }
                break;
            case "Enter": {
                if (!this.hasAttribute("open") || !this.#activeId) return;
                const active = options.find((o) => o.id === this.#activeId);
                if (active) {
                    event.preventDefault();
                    this.#select(active);
                }
                break;
            }
            case "Escape":
                if (this.hasAttribute("open")) {
                    event.preventDefault();
                    this.removeAttribute("open");
                }
                break;
            default:
                break;
        }
    };
}
