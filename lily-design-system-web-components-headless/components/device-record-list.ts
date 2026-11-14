// <lily-device-record-list>: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// Renders a light-DOM <ul class="device-record-list">. For any status but "known", status-label is the list's one item.
// Attributes: status (known | none-known | not-recorded | unavailable | omitted -> data-status), status-label, label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["status", "status-label", "label"]);

export class DeviceRecordList extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > ul.device-record-list")) return;
        const status = this.getAttribute("status") ?? "";
        const statusLabel = this.getAttribute("status-label") ?? "";
        const ul = document.createElement("ul");
        ul.className = rootClassName(this, "device-record-list");
        if (status) ul.setAttribute("data-status", status);
        ul.setAttribute("aria-label", this.getAttribute("label") ?? statusLabel);
        passThroughAttributes(this, ul, HANDLED);
        if (status !== "known") {
            const li = document.createElement("li");
            li.className = "device-record-list-status";
            li.textContent = statusLabel;
            ul.append(li);
        }
        moveChildrenInto(this, ul);
        this.appendChild(ul);
    }
}
