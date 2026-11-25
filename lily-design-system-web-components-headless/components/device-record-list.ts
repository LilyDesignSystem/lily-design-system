// <lily-device-record-list>: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// Renders a light-DOM <ul class="device-record-list">. For any status but "known", status-label is the list's one item.
// Attributes: status (known | none-known | not-recorded | unavailable | omitted | not-applicable -> data-status), status-label, label.
// A change to any of them, or to class, is shown; the entries are the app's and stay.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, setOrRemove } from "../lib/live-element.js";

const HANDLED = new Set(["status", "status-label", "label"]);

export class DeviceRecordList extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLUListElement>(":scope > ul.device-record-list");
        const status = this.text("status");
        const statusLabel = this.text("status-label");
        const ul = existing ?? document.createElement("ul");
        ul.className = rootClassName(this, "device-record-list");
        setOrRemove(ul, "data-status", status);
        ul.setAttribute("aria-label", this.getAttribute("label") ?? statusLabel);
        if (!existing) passThroughAttributes(this, ul, HANDLED);
        const own = (name: string, text: string | null): void => {
            const before = ul.querySelector(`:scope > li.device-record-list-${name}`);
            if (text === null) {
                before?.remove();
                return;
            }
            const li = before ?? document.createElement("li");
            li.className = `device-record-list-${name}`;
            li.textContent = text;
            if (!before) ul.prepend(li);
        };
        own("status", status === "known" ? null : statusLabel);
        if (existing) return;
        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
