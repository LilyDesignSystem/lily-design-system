// SharePage component
//
// A labelled <div role="group"> wrapper for page-sharing controls. The
// custom element stands in for the wrapper div directly (see
// lib/dom-utils.applySelfClassName).
//
// DEVIATION FROM ITS OWN AGENTS.md, FLAGGED NOT HIDDEN: that doc's Key
// Behaviors/Props describe this component generating a configurable
// `services` array of share buttons/links plus built-in Clipboard-API
// copy-link logic. The canonical svelte-headless source does none of
// that — it is a plain `<div role="group" aria-label>{children}</div>`,
// with the consumer composing their own share buttons/links as
// children (matching Button/DownloadButton/etc., which already exist
// in this catalog for that purpose). Followed here as the real,
// implemented contract; the richer AGENTS.md description appears to be
// aspirational documentation drift, not something any framework port
// actually builds.
//
// Attributes:
//   label — optional. Accessible label for the share group, via
//     aria-label (e.g. "Share this page").
//
// References:
//   - components/share-page/index.md (canonical contract)

import { applySelfClassName } from "../lib/dom-utils.js";

export class SharePage extends HTMLElement {
    #built = false;

    connectedCallback(): void {
        if (this.#built) return;
        this.#built = true;

        applySelfClassName(this, "share-page");
        this.setAttribute("role", "group");
        const label = this.getAttribute("label");
        if (label !== null) this.setAttribute("aria-label", label);
    }
}
