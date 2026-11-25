// <lily-medication-view>: a medicine's name, strength, form, route and frequency, none truncated (spec/healthcare-ui
// item 3). Renders a light-DOM <span class="medication-view">. Tall man letters come from the consumer as marked
// segments; Lily ships no list.
// Attributes: label, name, name-segments (JSON: [{"text":"hydr"},{"text":"ALAZINE","tallMan":true}]), strength, form,
//   route, frequency, dosage-text (FHIR Dosage.text).
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement } from "../lib/live-element.js";

const HANDLED = new Set([
    "label",
    "name",
    "name-segments",
    "strength",
    "form",
    "route",
    "frequency",
    "dosage-text",
]);

function parseSegments(raw: string | null): { text: string; tallMan?: boolean }[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export class MedicationView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(":scope > span.medication-view");
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const span = existing ?? document.createElement("span");
        span.replaceChildren();
        span.className = rootClassName(this, "medication-view");
        if (attr("label")) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${attr("label")} `;
            span.append(hidden);
        }
        const name = document.createElement("span");
        name.className = "medication-view-name";
        const segments = parseSegments(this.getAttribute("name-segments"));
        if (segments.length > 0) {
            for (const segment of segments) {
                if (segment.tallMan) {
                    const marked = document.createElement("span");
                    marked.className = "medication-view-tall-man";
                    marked.textContent = segment.text;
                    name.append(marked);
                } else name.append(segment.text);
            }
        } else name.textContent = attr("name");
        span.append(name);
        for (const [key, part_] of [
            ["strength", "strength"],
            ["form", "form"],
            ["route", "route"],
            ["frequency", "frequency"],
            ["dosage-text", "dosage"],
        ] as const) {
            if (!attr(key)) continue;
            const part = document.createElement("span");
            part.className = `medication-view-${part_}`;
            part.textContent = attr(key);
            span.append(" ", part);
        }
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
