// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <dl> > <div> tree with no custom-element host between them, and axe's
// `definition-list` / `dlitem` rules must report nothing (the <dl>-shaped
// equivalent of the `list` / `listitem` rules the other items in this
// batch are checked against).
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { SummaryListItem } from "./summary-list-item.js";

if (!customElements.get("lily-summary-list-item")) {
    customElements.define("lily-summary-list-item", SummaryListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<dl class="summary-list" aria-label="Order summary">' +
    '<lily-summary-list-item term="Product">Widget</lily-summary-list-item>' +
    '<lily-summary-list-item term="Quantity">3</lily-summary-list-item>' +
    '<lily-summary-list-item term="Total">$29.97</lily-summary-list-item>' +
    "</dl>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("SummaryListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-summary-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-summary-list-item")).toBeNull();
        expect(document.querySelectorAll("div.summary-list-item").length).toBe(3);
    });

    test("the <dl>'s direct children are all <div> — no wrapper host between them", () => {
        renderList();

        const dl = document.querySelector("dl.summary-list") as HTMLElement;
        const tags = Array.from(dl.children).map((el) => el.tagName);
        expect(tags).toEqual(["DIV", "DIV", "DIV"]);
    });

    test("term renders in a <dt> and children render in a <dd>", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("div.summary-list-item"));
        expect(items[0]!.querySelector("dt")!.textContent).toBe("Product");
        expect(items[0]!.querySelector("dd")!.textContent).toBe("Widget");
        expect(items[2]!.querySelector("dt")!.textContent).toBe("Total");
        expect(items[2]!.querySelector("dd")!.textContent).toBe("$29.97");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML =
            '<dl><lily-summary-list-item class="extra" term="X">Y</lily-summary-list-item></dl>';

        expect(document.querySelector("div")!.className).toBe("summary-list-item extra");
    });

    test("passes through rest attributes to the <div>", () => {
        document.body.innerHTML =
            '<dl><lily-summary-list-item data-testid="row" term="X">Y</lily-summary-list-item></dl>';

        expect(document.querySelector("div")!.getAttribute("data-testid")).toBe("row");
    });

    test("axe: the rendered list passes the definition-list and dlitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["definition-list", "dlitem"] });

        expect(results.violations).toEqual([]);
    });
});
