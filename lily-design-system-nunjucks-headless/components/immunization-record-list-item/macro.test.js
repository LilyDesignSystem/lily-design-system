import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("immunization-record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("immunization-record-list-item", {
            vaccine: "MMR vaccine",
            occurrence: "2025-09-12",
            occurrenceLabel: "12 Sep 2025",
            doseNumberLabel: "Dose 2 of 2",
            status: "completed",
            statusLabel: "Given",
            lotNumber: "AB1234",
        });
        const root = document.querySelector("li.immunization-record-list-item");
        expect(root.getAttribute("data-status")).toBe("completed");
        expect(root.querySelector(".immunization-record-list-item-vaccine").textContent).toBe(
            "MMR vaccine",
        );
        expect(
            root
                .querySelector("time.immunization-record-list-item-occurrence")
                .getAttribute("datetime"),
        ).toBe("2025-09-12");
        expect(root.querySelector(".immunization-record-list-item-dose-number").textContent).toBe(
            "Dose 2 of 2",
        );
        expect(root.querySelector(".immunization-record-list-item-status").textContent).toBe(
            "Given",
        );
        expect(root.querySelector(".immunization-record-list-item-lot-number").textContent).toBe(
            "AB1234",
        );
    });

    it("renders only the parts that are given", () => {
        const { document } = render("immunization-record-list-item", { vaccine: "MMR vaccine" });
        const root = document.querySelector("li.immunization-record-list-item");
        expect(root.querySelector(".immunization-record-list-item-occurrence")).toBeNull();
        expect(root.querySelector(".immunization-record-list-item-dose-number")).toBeNull();
        expect(root.querySelector(".immunization-record-list-item-status")).toBeNull();
        expect(root.querySelector(".immunization-record-list-item-lot-number")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });
});
