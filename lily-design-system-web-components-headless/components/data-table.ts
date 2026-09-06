// DataTable component
//
// A native <table role="grid"> for displaying and sorting tabular data.
// The consumer supplies rows/cells as light-DOM children — this catalog
// does not implement the table sub-element families.
//
// Attributes:
//   label — accessible name via aria-label, used only when `caption` is
//     absent (to avoid duplicate accessible names).
//   caption — visible caption text; when present, renders a real
//     <caption> element (which then serves as the accessible name).
//
// IMPORTANT — static HTML authoring constraint: per the HTML5 parsing spec,
// a start tag named thead/tbody/tfoot/tr/th/td/caption/col/colgroup is
// IGNORED (parse error, dropped) whenever the parser is not already inside
// a real <table> element's own insertion mode — which is exactly the
// situation while parsing this custom element's light-DOM children.
// Concretely: literal source markup like
//   <lily-table><thead><tr><th>...</th></tr></thead></lily-table>
// has its <thead>/<tr>/<th> tags silently discarded by the browser's own
// HTML parser before this element's connectedCallback ever runs — only
// the bare text content survives. The same applies to innerHTML
// assignment (it goes through the same parser). The only reliable way to
// populate this component's rows/cells is DOM construction
// (createElement/appendChild) rather than static/templated HTML strings.
// This is a real, verified browser/jsdom behaviour, not a bug in this
// component — see the misc-batch verification during the 2026-09-06
// completion push.
//
// References:
//   - components/data-table/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label", "caption"]);

export class DataTable extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > table.data-table")) return;

        const table = document.createElement("table");
        table.className = rootClassName(this, "data-table");
        table.setAttribute("role", "grid");

        const caption = this.getAttribute("caption");
        const label = this.getAttribute("label");
        if (caption === null && label !== null) table.setAttribute("aria-label", label);
        passThroughAttributes(this, table, HANDLED);

        if (caption !== null) {
            const captionEl = document.createElement("caption");
            captionEl.textContent = caption;
            table.appendChild(captionEl);
        }

        moveChildrenInto(this, table);
        this.appendChild(table);
    }
}
