import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("record-list-item", {
            status: "final",
            statusLabel: "Final",
            updated: "2026-11-03",
            updatedLabel: "Updated 3 Nov 2026",
            html: '<span class="content">Blood pressure 128/82 mmHg</span>',
        });
        const root = document.querySelector("li.record-list-item");
        expect(root.getAttribute("data-status")).toBe("final");
        expect(root.querySelector(".record-list-item-status").textContent).toBe("Final");
        expect(root.querySelector("time.record-list-item-updated").getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });

    it("renders only the parts that are given", () => {
        const { document } = render("record-list-item", {});
        const root = document.querySelector("li.record-list-item");
        expect(root.querySelector(".record-list-item-status")).toBeNull();
        expect(root.querySelector(".record-list-item-updated")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    it("withheld shows only the consumer's words; entered-in-error keeps the content struck through", () => {
        const withheld = render("record-list-item", { entryState: "withheld", entryStateLabel: "Restricted", html: "Blood pressure" })
            .document.querySelector("li.record-list-item");
        expect(withheld.getAttribute("data-entry-state")).toBe("withheld");
        expect(withheld.textContent).not.toContain("Blood pressure");
        expect(withheld.querySelector(".record-list-item-entry-state").textContent).toBe("Restricted");
        const inError = render("record-list-item", { entryState: "entered-in-error", entryStateLabel: "Entered in error", html: "Blood pressure" })
            .document.querySelector("li.record-list-item");
        expect(inError.querySelector("del.record-list-item-entry").textContent).toBe("Blood pressure");
        expect(inError.querySelector(".record-list-item-entry-state").textContent).toBe("Entered in error");
    });
});
