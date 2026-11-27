// InfoState component
//
// A <section role="status"> composition for empty, error, info, or
// success state messages: an optional illustration, a required <h2>
// title, an optional <p> description, and consumer content (typically an
// action area) appended after. A light-DOM child flagged
// `data-slot="illustration"` is moved above the title instead of after
// the description — the closest headless equivalent to the framework
// ports' separate illustration/action slot props, since this catalog has
// no shadow root and therefore no native <slot> to name them with.
//
// Attributes:
//   title — REQUIRED. Heading text, rendered in <h2 class="info-state-title">.
//   description — optional; rendered in <p class="info-state-description">.
//   level — "info" | "empty" | "error" | "success", default "info". Exposed
//     as data-level for consumer styling.
//   label — optional; aria-label override, defaults to title.
//
// References:
//   - components/info-state/index.md (canonical contract)
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement } from "../lib/live-element.js";

const HANDLED = new Set(["title", "description", "level", "label"]);

// A change to its attributes, or to class, is shown (tasks.md P50-T28).
export class InfoState extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLElement>(":scope > section.info-state");
        const section = existing ?? document.createElement("section");
        section.className = rootClassName(this, "info-state");
        section.setAttribute("role", "status");
        const title = this.text("title");
        section.setAttribute("aria-label", this.getAttribute("label") ?? title);
        section.setAttribute("data-level", this.getAttribute("level") ?? "info");
        if (existing) {
            const h2 = section.querySelector(":scope > .info-state-title");
            if (h2) h2.textContent = title;
            const description = this.getAttribute("description");
            let p = section.querySelector<HTMLParagraphElement>(":scope > .info-state-description");
            if (description === null) p?.remove();
            else {
                if (!p) {
                    p = document.createElement("p");
                    p.className = "info-state-description";
                    h2?.after(p);
                }
                p.textContent = description;
            }
            return;
        }
        passThroughAttributes(this, section, HANDLED);

        for (const child of Array.from(this.children)) {
            if (child.getAttribute("data-slot") === "illustration") section.appendChild(child);
        }

        const h2 = document.createElement("h2");
        h2.className = "info-state-title";
        h2.textContent = title;
        section.appendChild(h2);

        const description = this.getAttribute("description");
        if (description !== null) {
            const p = document.createElement("p");
            p.className = "info-state-description";
            p.textContent = description;
            section.appendChild(p);
        }

        moveChildrenInto(this, section);
        this.appendChild(section);
    }
}
