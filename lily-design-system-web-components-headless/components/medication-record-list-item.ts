// <lily-medication-record-list-item>: one medicine in a medication record list, with its status and when it applies (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="medication-record-list-item">, so the list's semantics hold.
// Attributes: status, status-label, effective, effective-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["status", "status-label", "effective", "effective-label"]);

export class MedicationRecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "medication-record-list-item");
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
        moveChildrenInto(this, li);
        add("span", "medication-record-list-item-status", attr("status-label"));
        add(
            "time",
            "medication-record-list-item-effective",
            attr("effective-label"),
            attr("effective"),
        );
        this.replaceWith(li);
    }
}
