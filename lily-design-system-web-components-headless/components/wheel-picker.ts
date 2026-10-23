// WheelPicker component
//
// A vertical single-select listbox where the selection follows the cursor: moving with the arrow keys, typing, or clicking
// an option chooses it. Use it to pick one of a short list (hours, minutes, months, years) in the manner of a scroll wheel.
// The element owns the roles and the keys; the wheel LOOK (scroll snapping, fading, 3-D) is the consumer's CSS.
//
// Options are declared as child <option> elements, as for a <select> (value, disabled, label = text), read when the element
// connects; set the `options` property to replace them later.
//
// Attributes:
//   label — REQUIRED. Accessible name of the listbox.
//   value — the selected option's value; absent or unknown selects nothing. Reflects the current selection.
//   loop — boolean. Arrow keys wrap from the last enabled option to the first and back.
//   page-size — number, default 5. Enabled options PageUp / PageDown move by.
//   disabled — boolean. Ignores keys and clicks; not focusable.
//   name — when set, a hidden input carries the value for a form.
//   Other attributes (id, data-*, aria-*) are passed through to the root <div>; the host's class follows the base class.
//
// Events: a bubbling `change` event when the selection changes (read `element.value`).
//
// Markup (light DOM, inside the host):
//   <div class="wheel-picker">
//     <div class="wheel-picker-list" role="listbox" aria-orientation="vertical" tabindex="0" aria-activedescendant>
//       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
//     </div>
//     <input type="hidden" name value>   (only with `name`)
//   </div>
//
// Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp, Home / End, PageDown / PageUp, type-ahead over the
// labels. Disabled options are skipped.
//
// References:
//   - components/wheel-picker/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import {
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    WHEEL_MOVE_KEYS,
    wheelTypeaheadIndex,
    type WheelMoveKey,
    type WheelOption,
    type WheelTypeahead,
} from "../lib/wheel-picker.js";

const HANDLED = new Set(["label", "value", "loop", "page-size", "disabled", "name"]);

export class WheelPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "loop", "page-size", "disabled", "name"];
    }

    #root: HTMLDivElement | null = null;
    #list: HTMLDivElement | null = null;
    #input: HTMLInputElement | null = null;
    #options: WheelOption[] = [];
    #uid = nextId("wheel-picker");
    #typeahead: WheelTypeahead = { prefix: "", at: 0 };

    get options(): WheelOption[] {
        return this.#options;
    }

    set options(options: WheelOption[]) {
        this.#options = options.map((o) => ({ ...o }));
        this.#render();
    }

    get value(): string {
        return this.getAttribute("value") ?? "";
    }

    set value(value: string) {
        if (value === this.value) return;
        this.setAttribute("value", value);
    }

    connectedCallback(): void {
        if (!this.#root) {
            this.#options = Array.from(this.querySelectorAll("option"), (o) => ({
                value: o.getAttribute("value") ?? o.textContent ?? "",
                label: o.textContent ?? "",
                disabled: o.hasAttribute("disabled"),
            }));
            const root = document.createElement("div");
            root.className = rootClassName(this, "wheel-picker");
            passThroughAttributes(this, root, HANDLED);
            const list = document.createElement("div");
            list.className = "wheel-picker-list";
            list.setAttribute("role", "listbox");
            list.setAttribute("aria-orientation", "vertical");
            list.addEventListener("keydown", this.#onKeydown);
            list.addEventListener("click", this.#onClick);
            root.appendChild(list);
            this.replaceChildren(root);
            this.#root = root;
            this.#list = list;
        }
        this.#render();
    }

    attributeChangedCallback(): void {
        this.#render();
    }

    get #selectedIndex(): number {
        const value = this.value;
        return this.#options.findIndex((o) => o.value === value);
    }

    get #isDisabled(): boolean {
        return this.hasAttribute("disabled");
    }

    #render(): void {
        const list = this.#list;
        const root = this.#root;
        if (!list || !root) return;
        const selected = this.#selectedIndex;

        list.setAttribute("aria-label", this.getAttribute("label") ?? "");
        if (this.#isDisabled) list.setAttribute("aria-disabled", "true");
        else list.removeAttribute("aria-disabled");
        list.tabIndex = this.#isDisabled ? -1 : 0;
        if (selected >= 0) list.setAttribute("aria-activedescendant", `${this.#uid}-option-${selected}`);
        else list.removeAttribute("aria-activedescendant");

        list.replaceChildren(
            ...this.#options.map((option, index) => {
                const el = document.createElement("div");
                el.className = "wheel-picker-option";
                el.setAttribute("role", "option");
                el.id = `${this.#uid}-option-${index}`;
                el.setAttribute("aria-selected", String(index === selected));
                if (option.disabled) el.setAttribute("aria-disabled", "true");
                el.setAttribute("data-value", option.value);
                el.setAttribute("data-index", String(index));
                el.textContent = option.label;
                return el;
            }),
        );

        const name = this.getAttribute("name");
        if (name) {
            if (!this.#input) {
                this.#input = document.createElement("input");
                this.#input.type = "hidden";
                root.appendChild(this.#input);
            }
            this.#input.name = name;
            this.#input.value = this.value;
        } else if (this.#input) {
            this.#input.remove();
            this.#input = null;
        }

        // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
        const option = selected >= 0 ? list.querySelector<HTMLElement>(`[data-index="${selected}"]`) : null;
        if (option) list.scrollTop = option.offsetTop - (list.clientHeight - option.offsetHeight) / 2;
    }

    #select(index: number): void {
        if (index < 0) return;
        const next = this.#options[index].value;
        if (next === this.value) return; // applying the selection already held is a no-op
        this.setAttribute("value", next);
        this.dispatchEvent(new Event("change", { bubbles: true }));
    }

    #onKeydown = (event: KeyboardEvent): void => {
        if (this.#isDisabled) return;
        if (WHEEL_MOVE_KEYS.includes(event.key)) {
            event.preventDefault();
            const pageSize = Number(this.getAttribute("page-size") ?? 5);
            this.#select(nextWheelIndex(this.#options, this.#selectedIndex, event.key as WheelMoveKey, { loop: this.hasAttribute("loop"), pageSize }));
        } else if (isWheelTypeaheadKey(event)) {
            this.#typeahead = nextWheelPrefix(this.#typeahead, event.key, Date.now());
            this.#select(wheelTypeaheadIndex(this.#options, this.#selectedIndex, this.#typeahead.prefix));
        }
    };

    #onClick = (event: MouseEvent): void => {
        if (this.#isDisabled) return;
        const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
        if (!target || target.getAttribute("aria-disabled") === "true") return;
        this.#select(Number(target.getAttribute("data-index")));
        this.#list?.focus();
    };
}
