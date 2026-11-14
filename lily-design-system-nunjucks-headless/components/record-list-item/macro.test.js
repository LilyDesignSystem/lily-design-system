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
});
