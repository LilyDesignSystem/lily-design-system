// Table component
//
// A native <table>. The consumer supplies all table content (thead, tbody,
// tfoot, caption, colgroup, rows, cells, …) as light-DOM children, which are
// moved into the generated <table>. This catalog does not implement the
// table sub-element families (thead/tbody/tr/th/td) — a permanent,
// documented wrapper-host limitation — so those come from the consumer
// exactly as they would to a plain HTML <table>.
//
// Attributes:
//   label — REQUIRED. Accessible name, via aria-label.
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
//   - components/table/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["label"]);

export class Table extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > table.table")) return;

        const table = document.createElement("table");
        table.className = rootClassName(this, "table");
        const label = this.getAttribute("label");
        if (label !== null) table.setAttribute("aria-label", label);
        passThroughAttributes(this, table, HANDLED);

        moveChildrenInto(this, table);
        this.appendChild(table);
    }
}
