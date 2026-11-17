// <lily-record-list-item>: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="record-list-item">, so the list's semantics hold.
// Attributes: subject-label (whose record it is, shown first), status, status-label, updated, updated-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["subject-label", "entry-state", "entry-state-label", "status", "status-label", "updated", "updated-label"]);

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
        if (attr("subject-label")) {
            add("span", "record-list-item-subject", attr("subject-label"));
            li.append(" ");
        }
        // entry-state: "withheld" shows only entry-state-label; "entered-in-error" keeps the content in a <del>, with the words.
        const state = attr("entry-state");
        if (state) li.setAttribute("data-entry-state", state);
        if (state === "withheld") add("span", "record-list-item-entry-state", attr("entry-state-label"));
        else if (state === "entered-in-error") {
            const del = document.createElement("del");
            del.className = "record-list-item-entry";
            moveChildrenInto(this, del);
            li.append(del);
            add("span", "record-list-item-entry-state", attr("entry-state-label"));
        } else moveChildrenInto(this, li);
        add("span", "record-list-item-status", attr("status-label"));
        add("time", "record-list-item-updated", attr("updated-label"), attr("updated"));
        this.replaceWith(li);
    }
}
