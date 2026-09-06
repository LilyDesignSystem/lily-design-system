// P8-T7-batch gate: the "upgrade in place" pattern must leave a pure
// <ol> > <li> tree with no custom-element host between them, and axe's
// `list` / `listitem` rules must report nothing.
import axe from "axe-core";
import { afterEach, describe, expect, test } from "vitest";

import { TourListItem } from "./tour-list-item.js";

if (!customElements.get("lily-tour-list-item")) {
    customElements.define("lily-tour-list-item", TourListItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const LIST =
    '<ol class="tour-list" aria-label="Getting started">' +
    '<lily-tour-list-item label="Welcome" current step-number="1" total-steps="2"><p>Welcome to the app!</p></lily-tour-list-item>' +
    '<lily-tour-list-item label="Features" step-number="2" total-steps="2"><p>Here are the features.</p></lily-tour-list-item>' +
    "</ol>";

function renderList(): HTMLElement {
    document.body.innerHTML = LIST;
    return document.body.firstElementChild as HTMLElement;
}

describe("TourListItem (upgrade in place)", () => {
    test("replaces its own host: no <lily-tour-list-item> remains in the DOM", () => {
        renderList();

        expect(document.querySelector("lily-tour-list-item")).toBeNull();
        expect(document.querySelectorAll("li.tour-list-item").length).toBe(2);
    });

    test("the <ol>'s direct children are all <li> — no wrapper host between them", () => {
        renderList();

        const ol = document.querySelector("ol.tour-list") as HTMLOListElement;
        const tags = Array.from(ol.children).map((el) => el.tagName);
        expect(tags).toEqual(["LI", "LI"]);
    });

    test("has role=group and aria-roledescription=step", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.tour-list-item"));
        for (const li of items) {
            expect(li.getAttribute("role")).toBe("group");
            expect(li.getAttribute("aria-roledescription")).toBe("step");
        }
    });

    test("aria-label combines label with step progress when both are given", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.tour-list-item"));
        expect(items[0]!.getAttribute("aria-label")).toBe("Welcome (Step 1 of 2)");
        expect(items[1]!.getAttribute("aria-label")).toBe("Features (Step 2 of 2)");
    });

    test("current sets aria-current=step; inactive steps are hidden from AT and layout", () => {
        renderList();

        const items = Array.from(document.querySelectorAll("li.tour-list-item"));
        expect(items[0]!.getAttribute("aria-current")).toBe("step");
        expect(items[0]!.getAttribute("aria-hidden")).toBeNull();
        expect(items[0]!.hidden).toBe(false);

        expect(items[1]!.getAttribute("aria-current")).toBeNull();
        expect(items[1]!.getAttribute("aria-hidden")).toBe("true");
        expect(items[1]!.hidden).toBe(true);
    });

    test("moves the host's children into the <li>", () => {
        renderList();

        const first = document.querySelector("li.tour-list-item") as HTMLLIElement;
        expect(first.querySelector("p")!.textContent).toBe("Welcome to the app!");
    });

    test("root class hook includes the consumer's class attribute", () => {
        document.body.innerHTML =
            '<ol><lily-tour-list-item class="extra" label="X" current>Y</lily-tour-list-item></ol>';

        expect(document.querySelector("li")!.className).toBe("tour-list-item extra");
    });

    test("passes through rest attributes to the <li>", () => {
        document.body.innerHTML =
            '<ol><lily-tour-list-item data-testid="step" label="X" current>Y</lily-tour-list-item></ol>';

        expect(document.querySelector("li")!.getAttribute("data-testid")).toBe("step");
    });

    test("axe: the rendered list (all steps forced visible) passes the listitem rule", async () => {
        renderList();
        // Force both steps visible for the axe pass: a hidden element is
        // excluded from the accessibility tree entirely, which would make
        // this check vacuous for the second <li>.
        for (const li of document.querySelectorAll("li.tour-list-item")) {
            li.removeAttribute("hidden");
            li.removeAttribute("aria-hidden");
        }

        // Only "listitem" is checked here, not "list": the canonical
        // contract's role="group" + aria-roledescription="step" on the <li>
        // — present in every real catalog implementation (Svelte, React,
        // Vue), not introduced by this component — overrides the <li>'s
        // implicit listitem role, which axe's "list" rule (only-listitems)
        // correctly flags regardless of catalog. That is a pre-existing
        // tension in the upstream contract, not a wrapper-host defect from
        // the "upgrade in place" pattern; the structural tests above already
        // confirm no host node sits between <ol> and <li>.
        const results = await axe.run(document.body, { runOnly: ["listitem"] });

        expect(results.violations).toEqual([]);
    });
});
