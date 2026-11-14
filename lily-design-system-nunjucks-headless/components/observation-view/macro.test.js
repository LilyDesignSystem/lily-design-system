import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("observation-view", () => {
    it("renders a span with value, unit, flag and range", () => {
        const { document } = render("observation-view", {
            value: "5.9",
            unit: "mmol/L",
            interpretation: "H",
            flagLabel: "High",
            range: "3.5–5.3",
        });
        const root = document.querySelector("span.observation-view");
        expect(root.getAttribute("data-interpretation")).toBe("H");
        expect(root.querySelector(".observation-view-value").textContent).toBe("5.9");
        expect(root.querySelector(".observation-view-unit").textContent).toBe("mmol/L");
        expect(root.querySelector(".observation-view-flag").textContent).toBe("High");
        expect(root.querySelector(".observation-view-range").textContent).toBe("3.5–5.3");
        expect(root.textContent).toContain("5.9 mmol/L");
    });

    it("not-recorded and unavailable show different words, never a blank", () => {
        const a = render("observation-view", {
            status: "not-recorded",
            statusLabel: "Not recorded",
        }).document;
        expect(a.querySelector(".observation-view-status").textContent).toBe("Not recorded");
        expect(a.querySelector(".observation-view-value")).toBeNull();
        const b = render("observation-view", {
            status: "unavailable",
            statusLabel: "Result unavailable",
        }).document;
        expect(b.querySelector(".observation-view").getAttribute("data-status")).toBe(
            "unavailable",
        );
        expect(b.querySelector(".observation-view-status").textContent).toBe("Result unavailable");
    });

    it("label renders as hidden text, not aria-label", () => {
        const { document } = render("observation-view", { label: "Potassium", value: "4.1" });
        expect(document.querySelector(".screen-reader-span").textContent).toBe("Potassium ");
        expect(document.querySelector(".observation-view").hasAttribute("aria-label")).toBe(false);
    });
});
