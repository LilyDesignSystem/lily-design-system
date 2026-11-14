// <lily-record-list-item>: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="record-list-item">, so the list's semantics hold.
// Attributes: status, status-label, updated, updated-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["status", "status-label", "updated", "updated-label"]);

export class RecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "record-list-item");
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
        add("span", "record-list-item-status", attr("status-label"));
        add("time", "record-list-item-updated", attr("updated-label"), attr("updated"));
        this.replaceWith(li);
    }
}
