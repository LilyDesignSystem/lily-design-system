// <lily-immunization-record-list-item>: one immunization in an immunization record list, with vaccine, date, dose and status (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="immunization-record-list-item">, so the list's semantics hold.
// Attributes: subject-label (whose record it is, shown first), vaccine, occurrence, occurrence-label, dose-number-label, status, status-label, lot-number.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "subject-label",
    "vaccine",
    "occurrence",
    "occurrence-label",
    "dose-number-label",
    "status",
    "status-label",
    "lot-number",
]);

export class ImmunizationRecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "immunization-record-list-item");
        if (attr("status")) li.setAttribute("data-status", attr("status"));
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
            add("span", "immunization-record-list-item-subject", attr("subject-label"));
        }
        add("span", "immunization-record-list-item-vaccine", attr("vaccine"));
        add(
            "time",
            "immunization-record-list-item-occurrence",
            attr("occurrence-label"),
            attr("occurrence"),
        );
        add("span", "immunization-record-list-item-dose-number", attr("dose-number-label"));
        add("span", "immunization-record-list-item-status", attr("status-label"));
        add("span", "immunization-record-list-item-lot-number", attr("lot-number"));
        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
