// <lily-body-map>: marking regions of the body on a consumer-supplied drawing (spec/healthcare-ui item 11). Renders a
// light-DOM <fieldset class="body-map"> named by its legend; the element's children (the drawing) move into an
// aria-hidden .body-map-figure; every region is a real checkbox in a list, which submits with the form, and a click on
// a shape marked data-region toggles it. Chosen shapes get data-selected.
// Attributes: label, regions (JSON [{id,label}]), selected (JSON array of ids), name. Fires a bubbling "change"; the
// host's selected property reads the choice.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "regions", "selected", "name"]);

function parseList<T>(raw: string | null): T[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export class BodyMap extends HTMLElement {
    #fieldset: HTMLFieldSetElement | null = null;

    // A change to label, regions, selected, name or class is shown (tasks.md P50-T28): the regions are built again. selected is
    // the default, as a checkbox's checked attribute is: a region the person ticked or unticked keeps their choice.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const fieldset = this.#fieldset;
        const list = fieldset?.querySelector<HTMLElement>(":scope > .body-map-regions");
        if (!fieldset || !list) return;
        fieldset.className = rootClassName(this, "body-map");
        const legend = fieldset.querySelector(":scope > .body-map-legend");
        if (legend) legend.textContent = this.getAttribute("label") ?? "";
        // What the person changed: a box whose state is not its default.
        const changed = new Map<string, boolean>();
        for (const box of list.querySelectorAll<HTMLInputElement>("input"))
            if (box.checked !== box.defaultChecked) changed.set(box.value, box.checked);
        list.replaceWith(this.#regions(changed));
        this.#mirror();
    }

    connectedCallback(): void {
        if (this.#fieldset) return;
        const fieldset = document.createElement("fieldset");
        fieldset.className = rootClassName(this, "body-map");
        passThroughAttributes(this, fieldset, HANDLED);
        const legend = document.createElement("legend");
        legend.className = "body-map-legend";
        legend.textContent = this.getAttribute("label") ?? "";
        fieldset.append(legend);

        let figure: HTMLDivElement | null = null;
        if (this.childNodes.length > 0) {
            figure = document.createElement("div");
            figure.className = "body-map-figure";
            figure.setAttribute("aria-hidden", "true");
            moveChildrenInto(this, figure);
            fieldset.append(figure);
        }

        fieldset.append(this.#regions(new Map()));

        figure?.addEventListener("click", (event) => {
            const id = (event.target as Element | null)
                ?.closest("[data-region]")
                ?.getAttribute("data-region");
            const box = id
                ? fieldset.querySelector<HTMLInputElement>(`input[value="${CSS.escape(id)}"]`)
                : null;
            if (!box) return;
            box.checked = !box.checked;
            box.dispatchEvent(new Event("change", { bubbles: true }));
        });

        this.appendChild(fieldset);
        this.#fieldset = fieldset;
        this.#mirror();
    }

    #regions(changed: Map<string, boolean>): HTMLUListElement {
        const regions = parseList<{ id: string; label: string }>(this.getAttribute("regions"));
        const chosen = new Set(parseList<string>(this.getAttribute("selected")));
        const list = document.createElement("ul");
        list.className = "body-map-regions";
        for (const region of regions) {
            const li = document.createElement("li");
            const label = document.createElement("label");
            label.className = "body-map-region";
            const input = document.createElement("input");
            input.type = "checkbox";
            if (this.getAttribute("name")) input.name = this.getAttribute("name") as string;
            input.value = region.id;
            input.defaultChecked = chosen.has(region.id);
            input.checked = changed.get(region.id) ?? input.defaultChecked;
            input.addEventListener("change", () => this.#mirror());
            label.append(input, ` ${region.label}`);
            li.append(label);
            list.append(li);
        }
        return list;
    }

    get selected(): string[] {
        return [
            ...(this.#fieldset?.querySelectorAll<HTMLInputElement>(
                ".body-map-regions input:checked",
            ) ?? []),
        ].map((i) => i.value);
    }

    #mirror(): void {
        const chosen = this.selected;
        for (const shape of this.#fieldset?.querySelectorAll(".body-map-figure [data-region]") ??
            []) {
            if (chosen.includes(shape.getAttribute("data-region") ?? ""))
                shape.setAttribute("data-selected", "true");
            else shape.removeAttribute("data-selected");
        }
    }
}
