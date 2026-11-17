// <lily-repeatable-fieldset>: the "add another" pattern (tasks.md P29-T10). Builds a light-DOM <fieldset
// class="repeatable-fieldset"> holding one <fieldset class="repeatable-fieldset-item"> per item, each a clone of the element's
// <template> child, with a legend and a remove button, and an add button. Words come from templates in which "{n}" is the
// item's number, so no English is built.
// Attributes: legend, item-legend ("Medicine {n}"), add-label, remove-label ("Remove medicine {n}"), added-label and
//   removed-label (optional, announced politely), count (the starting number of items, default 1), min (default 0), max.
// Events: "add" and "remove", with detail { index }. Property: count.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "legend",
    "item-legend",
    "add-label",
    "remove-label",
    "added-label",
    "removed-label",
    "count",
    "min",
    "max",
]);
const FOCUSABLE = "input, select, textarea, button, [tabindex]:not([tabindex='-1'])";

export class RepeatableFieldset extends HTMLElement {
    #root: HTMLFieldSetElement | null = null;
    #template: HTMLTemplateElement | null = null;
    #add: HTMLButtonElement | null = null;
    #status: HTMLParagraphElement | null = null;

    get count(): number {
        return this.#items().length;
    }

    connectedCallback(): void {
        if (this.#root) return;
        this.#template = this.querySelector(":scope > template");
        const root = document.createElement("fieldset");
        root.className = rootClassName(this, "repeatable-fieldset");
        passThroughAttributes(this, root, HANDLED);
        const legend = document.createElement("legend");
        legend.textContent = this.getAttribute("legend") ?? "";
        root.append(legend);
        const add = document.createElement("button");
        add.type = "button";
        add.className = "repeatable-fieldset-add";
        add.textContent = this.getAttribute("add-label") ?? "";
        add.addEventListener("click", () => this.#addItem());
        root.append(add);
        if (this.hasAttribute("added-label") || this.hasAttribute("removed-label")) {
            const status = document.createElement("p");
            status.className = "repeatable-fieldset-status";
            status.setAttribute("role", "status");
            root.append(status);
            this.#status = status;
        }
        this.#root = root;
        this.#add = add;
        this.appendChild(root);
        const count = Math.max(Number(this.getAttribute("count") ?? "1") || 0, this.#min());
        for (let i = 0; i < count; i++) this.#append();
        this.#renumber();
    }

    #min(): number {
        return Number(this.getAttribute("min") ?? "0") || 0;
    }

    #max(): number | undefined {
        const max = this.getAttribute("max");
        return max === null ? undefined : Number(max);
    }

    #items(): HTMLFieldSetElement[] {
        return this.#root
            ? [
                  ...this.#root.querySelectorAll<HTMLFieldSetElement>(
                      ":scope > .repeatable-fieldset-item",
                  ),
              ]
            : [];
    }

    #words(name: string, n: number): string {
        return (this.getAttribute(name) ?? "").replaceAll("{n}", String(n));
    }

    #append(): HTMLFieldSetElement {
        const item = document.createElement("fieldset");
        item.className = "repeatable-fieldset-item";
        const legend = document.createElement("legend");
        legend.className = "repeatable-fieldset-item-legend";
        item.append(legend);
        if (this.#template) item.append(this.#template.content.cloneNode(true));
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "repeatable-fieldset-remove";
        remove.addEventListener("click", () => this.#removeItem(item));
        item.append(remove);
        this.#root!.insertBefore(item, this.#add);
        return item;
    }

    /** Legends, labels, data-index and the remove and add buttons' state follow the count. */
    #renumber(): void {
        const items = this.#items();
        const canRemove = items.length > this.#min();
        items.forEach((item, index) => {
            item.dataset.index = String(index);
            item.querySelector(":scope > legend")!.textContent = this.#words(
                "item-legend",
                index + 1,
            );
            const remove = item.querySelector<HTMLButtonElement>(
                ":scope > .repeatable-fieldset-remove",
            )!;
            remove.textContent = this.#words("remove-label", index + 1);
            remove.hidden = !canRemove;
        });
        const max = this.#max();
        this.#add!.disabled = max !== undefined && items.length >= max;
        this.#root!.dataset.count = String(items.length);
    }

    #addItem(): void {
        const max = this.#max();
        if (max !== undefined && this.count >= max) return;
        const item = this.#append();
        this.#renumber();
        const index = this.count - 1;
        if (this.#status) this.#status.textContent = this.#words("added-label", index + 1);
        item.querySelector<HTMLElement>(FOCUSABLE)?.focus();
        this.dispatchEvent(new CustomEvent("add", { bubbles: true, detail: { index } }));
    }

    #removeItem(item: HTMLFieldSetElement): void {
        if (this.count <= this.#min()) return;
        const index = this.#items().indexOf(item);
        item.remove();
        this.#renumber();
        if (this.#status) this.#status.textContent = this.#words("removed-label", index + 1);
        this.#add!.focus();
        this.dispatchEvent(new CustomEvent("remove", { bubbles: true, detail: { index } }));
    }
}
