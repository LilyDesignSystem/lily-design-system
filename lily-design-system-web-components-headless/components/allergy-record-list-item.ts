// <lily-allergy-record-list-item>: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="allergy-record-list-item">, so the list's semantics hold.
// Attributes: subject-label (whose record it is, shown first), substance, reaction, severity, severity-label, criticality, criticality-label, clinical-status, clinical-status-label, verification-status, verification-status-label, type-label, category-label, updated, updated-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "subject-label",
    "substance",
    "reaction",
    "severity",
    "severity-label",
    "criticality",
    "criticality-label",
    "clinical-status",
    "clinical-status-label",
    "verification-status",
    "verification-status-label",
    "type-label",
    "category-label",
    "updated",
    "updated-label",
]);

export class AllergyRecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "allergy-record-list-item");
        if (attr("severity")) li.setAttribute("data-severity", attr("severity"));
        if (attr("criticality")) li.setAttribute("data-criticality", attr("criticality"));
        if (attr("clinical-status"))
            li.setAttribute("data-clinical-status", attr("clinical-status"));
        if (attr("verification-status"))
            li.setAttribute("data-verification-status", attr("verification-status"));
        passThroughAttributes(this, li, HANDLED);
        // Each part is separated from the one before by a space; a part with no text is left out.
        const add = (tag: "span" | "time", className: string, text: string, datetime = "") => {
            if (!text) return;
            const el = document.createElement(tag);
            el.className = className;
            el.textContent = text;
            if (datetime) el.setAttribute("datetime", datetime);
            if (li.childNodes.length > 0) li.append(" ");
            li.append(el);
        };
        if (attr("subject-label")) {
            add("span", "allergy-record-list-item-subject", attr("subject-label"));
        }
        add("span", "allergy-record-list-item-substance", attr("substance"));
        add("span", "allergy-record-list-item-reaction", attr("reaction"));
        add("span", "allergy-record-list-item-severity", attr("severity-label"));
        add("span", "allergy-record-list-item-criticality", attr("criticality-label"));
        add("span", "allergy-record-list-item-clinical-status", attr("clinical-status-label"));
        add(
            "span",
            "allergy-record-list-item-verification-status",
            attr("verification-status-label"),
        );
        add("span", "allergy-record-list-item-type", attr("type-label"));
        add("span", "allergy-record-list-item-category", attr("category-label"));
        add("time", "allergy-record-list-item-updated", attr("updated-label"), attr("updated"));
        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
