// DontListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). A <ul> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Sets data-recommendation="dont" — this is not in the canonical
// components/dont-list-item/AGENTS.md Props table, but every real
// implementation (Svelte, React, Vue) renders it as a consumer styling
// hook, and html-headless's own placeholder file predates that detail.
// Followed the real cross-catalog implementation.
//
// Attributes:
//   ...rest — spread onto the <li>. Children move into the <li> unchanged.
//
// References:
//   - components/dont-list-item/index.md (canonical contract)
//   - Material Design Do/Don't guidelines: https://m3.material.io/foundations/content-design/style-guide/overview

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED: ReadonlySet<string> = new Set();

export class DontListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "dont-list-item");
        li.setAttribute("data-recommendation", "dont");
        passThroughAttributes(this, li, HANDLED);

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}
