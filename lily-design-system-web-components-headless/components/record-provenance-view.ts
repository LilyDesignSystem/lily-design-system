// <lily-record-provenance-view>: who recorded a record, where it came from, when, and whether it is signed or sent, in the
// consumer's words (tasks.md P29-T9). Renders a light-DOM <span class="record-provenance-view">.
// Attributes: label, attestation, attestation-label, sync, sync-label, source, source-label, author-label, observed, observed-label, recorded, recorded-label, version-label. attestation, sync and source are data-* attributes; the *-label ones are the words.
import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { LiveElement, part, setOrRemove } from "../lib/live-element.js";

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

// A change to any attribute, or to class, is shown (tasks.md P50-T28).
export class RecordProvenanceView extends LiveElement {
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLSpanElement>(
            ":scope > span.record-provenance-view",
        );
        const attr = (name: string) => this.text(name);
        const span = existing ?? document.createElement("span");
        span.className = rootClassName(this, "record-provenance-view");
        for (const name of ["attestation", "sync", "source"])
            setOrRemove(span, `data-${name}`, attr(name));
        span.replaceChildren();
        if (attr("label")) span.append(part("screen-reader-span", `${attr("label")} `));
        const add = (tag: "span" | "time", name: string, text: string, datetime = "") => {
            if (!text) return;
            const el = document.createElement(tag);
            el.className = `record-provenance-view-${name}`;
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
        if (existing) return;
        passThroughAttributes(this, span, HANDLED);
        this.appendChild(span);
    }
}
