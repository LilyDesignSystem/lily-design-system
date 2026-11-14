// <lily-problem-record-list-item>: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="problem-record-list-item">, so the list's semantics hold.
// Attributes: condition, clinical-status, clinical-status-label, verification-status, verification-status-label, severity-label, onset, onset-label, abatement, abatement-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "condition",
    "clinical-status",
    "clinical-status-label",
    "verification-status",
    "verification-status-label",
    "severity-label",
    "onset",
    "onset-label",
    "abatement",
    "abatement-label",
]);

export class ProblemRecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "problem-record-list-item");
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
        add("span", "problem-record-list-item-condition", attr("condition"));
        add("span", "problem-record-list-item-clinical-status", attr("clinical-status-label"));
        add(
            "span",
            "problem-record-list-item-verification-status",
            attr("verification-status-label"),
        );
        add("span", "problem-record-list-item-severity", attr("severity-label"));
        add("time", "problem-record-list-item-onset", attr("onset-label"), attr("onset"));
        add(
            "time",
            "problem-record-list-item-abatement",
            attr("abatement-label"),
            attr("abatement"),
        );
        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
