// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { TimelineListItem } from "./timeline-list-item.js";

if (!customElements.get("lily-timeline-list-item")) {
    customElements.define("lily-timeline-list-item", TimelineListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ol class="timeline-list" aria-label="Order history">' +
    '<lily-timeline-list-item datetime="2024-01-15" heading="January 15, 2024">Order placed</lily-timeline-list-item>' +
    "<lily-timeline-list-item>Status pending review</lily-timeline-list-item>" +
    "</ol>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("TimelineListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-timeline-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-timeline-list-item")).toBeNull();
        expect(document.querySelectorAll("li.timeline-list-item").length).toBe(2);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ol = document.querySelector("ol.timeline-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI"]);
    });

    test("renders a <time> with datetime and heading text only when provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.timeline-list-item"));
        const time = items[0]!.querySelector("time")!;
        expect(time.getAttribute("datetime")).toBe("2024-01-15");
        expect(time.textContent).toBe("January 15, 2024");

        expect(items[1]!.querySelector("time")).toBeNull();
    });

    test("moves the host's children into the <li> after the <time>", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.timeline-list-item"));
        expect(items[0]!.textContent).toBe("January 15, 2024Order placed");
        expect(items[1]!.textContent).toBe("Status pending review");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ol><lily-timeline-list-item class="extra">X</lily-timeline-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("timeline-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ol><lily-timeline-list-item data-testid="event">X</lily-timeline-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("event");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
