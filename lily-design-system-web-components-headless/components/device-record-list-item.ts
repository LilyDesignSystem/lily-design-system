// <lily-device-record-list-item>: one medical device in a device record list, with its status and when it was used (tasks.md P28-T3, spec/healthcare-ui). Upgrades in place: it replaces
// itself with a real <li class="device-record-list-item">, so the list's semantics hold.
// Attributes: device, status, status-label, timing, timing-label.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["device", "status", "status-label", "timing", "timing-label"]);

export class DeviceRecordListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const li = document.createElement("li");
        li.className = rootClassName(this, "device-record-list-item");
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
        add("span", "device-record-list-item-device", attr("device"));
        add("span", "device-record-list-item-status", attr("status-label"));
        add("time", "device-record-list-item-timing", attr("timing-label"), attr("timing"));
        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
