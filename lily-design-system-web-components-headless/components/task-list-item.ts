// TaskListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). An <ol> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes into it,
// then replaces itself.
//
// Deviation from the canonical AGENTS.md Props table (a `completed`
// boolean rendering data-completed, plus a generic children slot): every
// real implementation (Svelte, React, Vue) instead renders a REQUIRED
// `label`, a bindable `checked` boolean, and a `disabled` boolean, wrapping
// a real <input type="checkbox"> in a <label> — data-checked/data-disabled
// are consumer styling hooks alongside the native control, not a
// substitute for it. Followed the real cross-catalog implementation. This
// component has no light-DOM children slot: the checkbox's own label text
// comes from the `label` attribute.
//
// The checkbox reflects only its INITIAL checked state — after upgrade
// there is no host instance left to react to further attribute changes
// (the accepted "upgrade in place" cost, see breadcrumb-list-item.ts).
// Toggling is native checkbox behaviour from that point on and needs no
// script.
//
// Attributes:
//   label — REQUIRED. The task description, rendered as the checkbox's
//     wrapping <label> text.
//   checked — presence-based boolean; sets the checkbox's initial checked
//     state and data-checked.
//   disabled — presence-based boolean; sets the checkbox's disabled state
//     and data-disabled.
//   ...rest — spread onto the <li>.
//
// References:
//   - components/task-list-item/index.md (canonical contract)
//   - MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
//   - WAI checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "checked", "disabled"]);

export class TaskListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const checked = this.hasAttribute("checked");
        const disabled = this.hasAttribute("disabled");

        const li = document.createElement("li");
        li.className = rootClassName(this, "task-list-item");
        li.setAttribute("data-checked", String(checked));
        if (disabled) li.setAttribute("data-disabled", "true");
        passThroughAttributes(this, li, HANDLED);

        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = checked;
        input.disabled = disabled;
        label.appendChild(input);
        label.appendChild(document.createTextNode(this.getAttribute("label") ?? ""));
        li.appendChild(label);

        this.replaceWith(li);
    }
}
