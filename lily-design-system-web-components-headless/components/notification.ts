// Notification component
//
// A live-region <div> delivering a brief message about an event or
// update. The custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// Attributes:
//   label — optional. Accessible name for the notification region, via
//     aria-label.
//   urgent — presence-based boolean. When present, uses role="alert" and
//     aria-live="assertive" instead of role="status"/aria-live="polite".
//
// References:
//   - components/notification/index.md (canonical contract)
//   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
//   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

import { applySelfClassName } from "../lib/dom-utils.js";
import { LiveElement, setOrRemove } from "../lib/live-element.js";

// A change to urgent, label or class is shown (tasks.md P50-T28); the message is the consumer's children.
export class Notification extends LiveElement {
    static get observedAttributes(): string[] {
        return ["urgent", "label", "class"];
    }

    protected update(): void {
        applySelfClassName(this, "notification");
        const urgent = this.hasAttribute("urgent");
        this.setAttribute("role", urgent ? "alert" : "status");
        this.setAttribute("aria-live", urgent ? "assertive" : "polite");
        setOrRemove(this, "aria-label", this.getAttribute("label"));
    }
}
