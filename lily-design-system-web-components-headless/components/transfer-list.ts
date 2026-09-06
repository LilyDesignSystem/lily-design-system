// TransferList component
//
// A dual list box for moving items between two lists. Renders a
// <div role="group">; the custom element stands in for that div directly
// (see lib/dom-utils.applySelfClassName) since <div> has no native
// behaviour worth preserving as a separate element.
//
// `source`, `target`, and `actions` are "slots" per the canonical
// contract; since this catalog is light-DOM only (no shadow root, no real
// <slot>), a slotted child is marked `slot="source"` / `slot="target"` /
// `slot="actions"` and this component distributes it into the matching
// region — the same convention FeaturePhoto/InputGroup use.
//
// Attributes:
//   label — REQUIRED. Accessible name for the group, via aria-label.
//   source-label — REQUIRED. aria-label for the source <section>.
//   target-label — REQUIRED. aria-label for the target <section>.
//
// Usage:
//   <lily-transfer-list label="Assign roles" source-label="Available roles" target-label="Selected roles">
//     <ul role="listbox" slot="source">…</ul>
//     <div slot="actions"><button type="button">→</button><button type="button">←</button></div>
//     <ul role="listbox" slot="target">…</ul>
//   </lily-transfer-list>
//
// References:
//   - components/transfer-list/index.md (canonical contract)
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
//   - Ant Design Transfer: https://ant.design/components/transfer

import { applySelfClassName } from "../lib/dom-utils.js";

function distribute(host: Element, slotName: string, target: Element): void {
    const nodes = Array.from(host.querySelectorAll(`:scope > [slot="${slotName}"]`));
    for (const node of nodes) target.appendChild(node);
}

export class TransferList extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "transfer-list");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);

        const source = document.createElement("section");
        source.className = "transfer-list-source";
        const sourceLabel = this.getAttribute("source-label");
        if (sourceLabel !== null) source.setAttribute("aria-label", sourceLabel);

        const actions = document.createElement("div");
        actions.className = "transfer-list-actions";

        const target = document.createElement("section");
        target.className = "transfer-list-target";
        const targetLabel = this.getAttribute("target-label");
        if (targetLabel !== null) target.setAttribute("aria-label", targetLabel);

        distribute(this, "source", source);
        distribute(this, "actions", actions);
        distribute(this, "target", target);

        this.appendChild(source);
        if (actions.hasChildNodes()) this.appendChild(actions);
        this.appendChild(target);
    }
}
