// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { StepListItem } from "./step-list-item.js";

if (!customElements.get("lily-step-list-item")) {
    customElements.define("lily-step-list-item", StepListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ol class="step-list" aria-label="Checkout">' +
    '<lily-step-list-item status="finished">Cart</lily-step-list-item>' +
    '<lily-step-list-item status="in-progress" current label="Step 2: Shipping">Shipping</lily-step-list-item>' +
    "<lily-step-list-item>Payment</lily-step-list-item>" +
    "</ol>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("StepListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-step-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-step-list-item")).toBeNull();
        expect(document.querySelectorAll("li.step-list-item").length).toBe(3);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ol = document.querySelector("ol.step-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI", "LI"]);
    });

    test("data-status reflects the status prop, defaulting to waiting", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.step-list-item"));
        expect(items.map((li) => li.getAttribute("data-status"))).toEqual(["finished", "in-progress", "waiting"]);
    });

    test("aria-current=step is set only when current is present", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.step-list-item"));
        expect(items.map((li) => li.getAttribute("aria-current"))).toEqual([null, "step", null]);
    });

    test("aria-label equals the label prop when provided", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.step-list-item"));
        expect(items[1]!.getAttribute("aria-label")).toBe("Step 2: Shipping");
        expect(items[0]!.getAttribute("aria-label")).toBeNull();
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.step-list-item") as HTMLLIElement;
        expect(first.textContent).toBe("Cart");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML = '<ol><lily-step-list-item class="extra">X</lily-step-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("step-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML = '<ol><lily-step-list-item data-testid="step">X</lily-step-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("step");
    });

    test("axe: the rendered list passes the list and listitem rules", async () => {
        renderList();

        const results = await axe.run(document.body, { runOnly: ["list", "listitem"] });

        expect(results.violations).toEqual([]);
    });
});
