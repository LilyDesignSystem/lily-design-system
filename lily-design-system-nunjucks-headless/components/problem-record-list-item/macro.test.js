import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("problem-record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("problem-record-list-item", {
            condition: "Type 2 diabetes",
            clinicalStatus: "active",
            clinicalStatusLabel: "Active",
            verificationStatus: "confirmed",
            verificationStatusLabel: "Confirmed",
            severityLabel: "Moderate",
            onset: "2019-06-01",
            onsetLabel: "Since June 2019",
            abatement: "2024-01-15",
            abatementLabel: "Resolved 15 Jan 2024",
        });
        const root = document.querySelector("li.problem-record-list-item");
        expect(root.getAttribute("data-clinical-status")).toBe("active");
        expect(root.getAttribute("data-verification-status")).toBe("confirmed");
        expect(root.querySelector(".problem-record-list-item-condition").textContent).toBe(
            "Type 2 diabetes",
        );
        expect(root.querySelector(".problem-record-list-item-clinical-status").textContent).toBe(
            "Active",
        );
        expect(
            root.querySelector(".problem-record-list-item-verification-status").textContent,
        ).toBe("Confirmed");
        expect(root.querySelector(".problem-record-list-item-severity").textContent).toBe(
            "Moderate",
        );
        expect(
            root.querySelector("time.problem-record-list-item-onset").getAttribute("datetime"),
        ).toBe("2019-06-01");
        expect(
            root.querySelector("time.problem-record-list-item-abatement").getAttribute("datetime"),
        ).toBe("2024-01-15");
    });

    it("renders only the parts that are given", () => {
        const { document } = render("problem-record-list-item", { condition: "Type 2 diabetes" });
        const root = document.querySelector("li.problem-record-list-item");
        expect(root.querySelector(".problem-record-list-item-clinical-status")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-verification-status")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-severity")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-onset")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-abatement")).toBeNull();
        expect(root.hasAttribute("data-clinical-status")).toBe(false);
        expect(root.hasAttribute("data-verification-status")).toBe(false);
    });
});
