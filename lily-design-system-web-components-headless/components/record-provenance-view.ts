// <lily-record-provenance-view>: who recorded a record, where it came from, when, and whether it is signed or sent, in the
// consumer's words (tasks.md P29-T9). Renders a light-DOM <span class="record-provenance-view">.
// Attributes: label, attestation, attestation-label, sync, sync-label, source, source-label, author-label, observed, observed-label, recorded, recorded-label, version-label. attestation, sync and source are data-* attributes; the *-label ones are the words.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set([
    "label",
    "attestation",
    "attestation-label",
    "sync",
    "sync-label",
    "source",
    "source-label",
    "author-label",
    "observed",
    "observed-label",
    "recorded",
    "recorded-label",
    "version-label",
]);

export class RecordProvenanceView extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > span.record-provenance-view")) return;
        const attr = (name: string) => this.getAttribute(name) ?? "";
        const span = document.createElement("span");
        span.className = rootClassName(this, "record-provenance-view");
        for (const name of ["attestation", "sync", "source"])
            if (attr(name)) span.setAttribute(`data-${name}`, attr(name));
        if (attr("label")) {
            const hidden = document.createElement("span");
            hidden.className = "screen-reader-span";
            hidden.textContent = `${attr("label")} `;
            span.append(hidden);
        }
        const add = (tag: "span" | "time", part: string, text: string, datetime = "") => {
            if (!text) return;
            const el = document.createElement(tag);
            el.className = `record-provenance-view-${part}`;
            el.textContent = text;
            if (datetime) el.setAttribute("datetime", datetime);
            span.append(el, " ");
        };
        add("span", "attestation", attr("attestation-label"));
        add("span", "sync", attr("sync-label"));
        add("span", "source", attr("source-label"));
        add("span", "author", attr("author-label"));
        add("time", "observed", attr("observed-label"), attr("observed"));
        add("time", "recorded", attr("recorded-label"), attr("recorded"));
        add("span", "version", attr("version-label"));
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
