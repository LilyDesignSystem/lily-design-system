// <lily-allergy-list-item>: one allergy or intolerance (spec/healthcare-ui item 2). Upgrades in place: it replaces
// itself with a real <li class="allergy-list-item">, so the list's semantics hold.
// Attributes: substance, reaction, severity (mild | moderate | severe -> data-severity), severity-label, updated,
//   updated-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "substance",
    "reaction",
    "severity",
    "severity-label",
    "updated",
    "updated-label",
]);

export class AllergyListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "allergy-list-item");
        if (attr("severity")) li.setAttribute("data-severity", attr("severity"));
        passThroughAttributes(this, li, HANDLED);
        const substance = document.createElement("span");
        substance.className = "allergy-list-item-substance";
        substance.textContent = attr("substance");
        li.append(substance);
        for (const [name, text] of [
            ["reaction", attr("reaction")],
            ["severity", attr("severity-label")],
        ]) {
            if (!text) continue;
            const span = document.createElement("span");
            span.className = `allergy-list-item-${name}`;
            span.textContent = text;
            li.append(" ", span);
        }
        if (attr("updated-label")) {
            const time = document.createElement("time");
            time.className = "allergy-list-item-updated";
            if (attr("updated")) time.dateTime = attr("updated");
            time.textContent = attr("updated-label");
            li.append(" ", time);
        }
        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
