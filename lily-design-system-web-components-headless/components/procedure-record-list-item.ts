// <lily-procedure-record-list-item>: one procedure in a procedure record list, with its status and when it was performed (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="procedure-record-list-item">, so the list's semantics hold.
// Attributes: procedure, status, status-label, performed, performed-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["procedure", "status", "status-label", "performed", "performed-label"]);

export class ProcedureRecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "procedure-record-list-item");
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
        add("span", "procedure-record-list-item-procedure", attr("procedure"));
        add("span", "procedure-record-list-item-status", attr("status-label"));
        add(
            "time",
            "procedure-record-list-item-performed",
            attr("performed-label"),
            attr("performed"),
        );
        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
