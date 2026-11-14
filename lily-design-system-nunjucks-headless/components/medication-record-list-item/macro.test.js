import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("medication-record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("medication-record-list-item", {
            status: "active",
            statusLabel: "Active",
            effective: "2025-03-03",
            effectiveLabel: "Since 3 Mar 2025",
            html: '<span class="content">ramipril 5 mg capsule, oral, once a day</span>',
        });
        const root = document.querySelector("li.medication-record-list-item");
        expect(root.getAttribute("data-status")).toBe("active");
        expect(root.querySelector(".medication-record-list-item-status").textContent).toBe(
            "Active",
        );
        expect(
            root
                .querySelector("time.medication-record-list-item-effective")
                .getAttribute("datetime"),
        ).toBe("2025-03-03");
    });

    it("renders only the parts that are given", () => {
        const { document } = render("medication-record-list-item", {});
        const root = document.querySelector("li.medication-record-list-item");
        expect(root.querySelector(".medication-record-list-item-status")).toBeNull();
        expect(root.querySelector(".medication-record-list-item-effective")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });
});
