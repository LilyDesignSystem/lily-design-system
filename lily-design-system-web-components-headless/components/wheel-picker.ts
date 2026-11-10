// WheelPicker component
//
// A single-select listbox, vertical by default, where the selection follows the cursor: moving with the arrow keys, typing, or clicking
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
//   orientation — "vertical" (default) or "horizontal". Horizontal moves with ArrowLeft / ArrowRight, swapped right-to-left
//     (the nearest `dir`).
//   name — when set, a hidden input carries the value for a form. It is disabled, so not submitted, while the element is
//     disabled, and a form reset puts the element back to the value it had when it connected.
//   form — the id of the form the hidden input belongs to, when the element sits outside it.
//   Other attributes (id, data-*, aria-*) are passed through to the root <div>; the host's class follows the base class.
//
// Events: a bubbling `change` event when the selection changes, by the user or by a form reset (read `element.value`).
//
// Markup (light DOM, inside the host):
//   <div class="wheel-picker">
//     <div class="wheel-picker-list" role="listbox" aria-orientation tabindex="0" aria-activedescendant>
//       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
//     </div>
//     <input type="hidden" name value form? disabled?>   (only with `name`)
//   </div>
//
// Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp (ArrowRight / ArrowLeft when horizontal), Home / End, PageDown / PageUp, type-ahead over the
// labels. Disabled options are skipped.
//
// References:
//   - components/wheel-picker/index.md (canonical contract)

import { nextId, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import {
    isWheelRtl,
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    wheelMoveKey,
    wheelTypeaheadIndex,
    type WheelOption,
    type WheelOrientation,
    type WheelTypeahead,
} from "../lib/wheel-picker.js";

const HANDLED = new Set([
    "label",
    "value",
    "loop",
    "page-size",
    "disabled",
    "orientation",
    "name",
    "form",
]);

export class WheelPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "value", "loop", "page-size", "disabled", "orientation", "name", "form"];
    }

    #root: HTMLDivElement | null = null;
    #list: HTMLDivElement | null = null;
    #input: HTMLInputElement | null = null;
    #options: WheelOption[] = [];
    #uid = nextId("wheel-picker");
    #typeahead: WheelTypeahead = { prefix: "", at: 0 };
    #initialValue: string | null = null;
    #form: HTMLElement | null = null;
    #resetTimer: ReturnType<typeof setTimeout> | undefined;

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
            list.addEventListener("keydown", this.#onKeydown);
            list.addEventListener("click", this.#onClick);
            root.appendChild(list);
            this.replaceChildren(root);
            this.#root = root;
            this.#list = list;
            this.#initialValue = this.value;
        }
        // Form reset: a hidden input keeps its value through a reset, so put the element back to its first value.
        const formId = this.getAttribute("form");
        this.#form = formId ? document.getElementById(formId) : this.closest("form");
        this.#form?.addEventListener("reset", this.#onReset);
        this.#render();
    }

    disconnectedCallback(): void {
        clearTimeout(this.#resetTimer);
        this.#form?.removeEventListener("reset", this.#onReset);
        this.#form = null;
    }

    // One tick after `reset`, once the browser has reset the DOM, and not when the reset was cancelled.
    #onReset = (event: Event): void => {
        clearTimeout(this.#resetTimer);
        this.#resetTimer = setTimeout(() => {
            const initial = this.#initialValue ?? "";
            if (event.defaultPrevented || initial === this.value) return;
            this.setAttribute("value", initial);
            this.dispatchEvent(new Event("change", { bubbles: true }));
        }, 0);
    };

    get #orientation(): WheelOrientation {
        return this.getAttribute("orientation") === "horizontal" ? "horizontal" : "vertical";
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
        list.setAttribute("aria-orientation", this.#orientation);
        if (this.#isDisabled) list.setAttribute("aria-disabled", "true");
        else list.removeAttribute("aria-disabled");
        list.tabIndex = this.#isDisabled ? -1 : 0;
        if (selected >= 0)
            list.setAttribute("aria-activedescendant", `${this.#uid}-option-${selected}`);
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
            this.#input.disabled = this.#isDisabled;
            const form = this.getAttribute("form");
            if (form) this.#input.setAttribute("form", form);
            else this.#input.removeAttribute("form");
        } else if (this.#input) {
            this.#input.remove();
            this.#input = null;
        }

        // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
        const option =
            selected >= 0 ? list.querySelector<HTMLElement>(`[data-index="${selected}"]`) : null;
        if (option) {
            // Move by the distance between the two middles: it works on either axis and in right-to-left.
            const box = list.getBoundingClientRect();
            const row = option.getBoundingClientRect();
            if (this.#orientation === "horizontal")
                list.scrollLeft += row.left + row.width / 2 - (box.left + box.width / 2);
            else list.scrollTop += row.top + row.height / 2 - (box.top + box.height / 2);
        }
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
        const move = wheelMoveKey(event.key, this.#orientation, isWheelRtl(this));
        if (move) {
            event.preventDefault();
            const pageSize = Number(this.getAttribute("page-size") ?? 5);
            this.#select(
                nextWheelIndex(this.#options, this.#selectedIndex, move, {
                    loop: this.hasAttribute("loop"),
                    pageSize,
                }),
            );
        } else if (isWheelTypeaheadKey(event)) {
            this.#typeahead = nextWheelPrefix(this.#typeahead, event.key, Date.now());
            this.#select(
                wheelTypeaheadIndex(this.#options, this.#selectedIndex, this.#typeahead.prefix),
            );
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
