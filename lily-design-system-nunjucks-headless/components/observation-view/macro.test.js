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

    it.each([
        ["amended", "Amended"],
        ["corrected", "Corrected"],
        ["entered-in-error", "Entered in error"],
    ])("an %s result shows its value with its words beside it", (status, words) => {
        const { document } = render("observation-view", {
            value: "5.9",
            status,
            statusLabel: words,
        });
        expect(document.querySelector(".observation-view-value").textContent).toBe("5.9");
        expect(document.querySelector(".observation-view-status").textContent).toBe(words);
    });

    it.each([
        ["cancelled", "Test cancelled"],
        ["masked", "Withheld"],
    ])("a %s result shows its words instead of a value", (status, words) => {
        const { document } = render("observation-view", {
            value: "5.9",
            status,
            statusLabel: words,
        });
        expect(document.querySelector(".observation-view-value")).toBeNull();
        expect(document.querySelector(".observation-view-status").textContent).toBe(words);
    });

    it("label renders as hidden text, not aria-label", () => {
        const { document } = render("observation-view", { label: "Potassium", value: "4.1" });
        expect(document.querySelector(".screen-reader-span").textContent).toBe("Potassium ");
        expect(document.querySelector(".observation-view").hasAttribute("aria-label")).toBe(false);
    });

    it("not-applicable replaces the value with the consumer's words", () => {
        const { document } = render("observation-view", {
            value: "",
            status: "not-applicable",
            statusLabel: "Not applicable",
        });
        const root = document.querySelector(".observation-view");
        expect(root.getAttribute("data-status")).toBe("not-applicable");
        expect(root.querySelector(".observation-view-status").textContent).toBe("Not applicable");
        expect(root.querySelector(".observation-view-value")).toBeNull();
    });

    it("never infers an interpretation, renders named ranges, and keeps a superseded value", () => {
        const { document } = render("observation-view", {
            value: "4.8",
            range: "3.5–5.3",
            ranges: [{ label: "Critical", text: "below 2.5" }],
            status: "corrected",
            statusLabel: "Corrected",
            previousValue: "5.1",
            previousLabel: "was 5.1 until 3 Nov",
        });
        const root = document.querySelector(".observation-view");
        expect(root.hasAttribute("data-interpretation")).toBe(false);
        expect(root.querySelector(".observation-view-flag")).toBeNull();
        const ranges = root.querySelectorAll(".observation-view-range");
        expect(ranges).toHaveLength(2);
        expect(ranges[1].textContent).toBe("Critical below 2.5");
        expect(root.querySelector("del.observation-view-previous-value").textContent).toBe("5.1");
        expect(root.querySelector(".observation-view-previous-label").textContent).toBe(
            "was 5.1 until 3 Nov",
        );
    });

    it("a meter shows where the value sits, hidden from assistive technology because the words say it", () => {
        const { document } = render("observation-view", {
            value: "5.9",
            interpretation: "H",
            flagLabel: "High",
            meterValue: 5.9,
            meterMin: 2,
            meterMax: 8,
            meterLow: 3.5,
            meterHigh: 5.3,
            meterOptimum: 4.4,
        });
        const meter = document.querySelector("meter.observation-view-meter");
        expect(meter.getAttribute("aria-hidden")).toBe("true");
        expect(
            ["value", "min", "max", "low", "high", "optimum"].map((a) => meter.getAttribute(a)),
        ).toEqual(["5.9", "2", "8", "3.5", "5.3", "4.4"]);
    });

    it("no meter without a value, min and max, or for a missing result", () => {
        expect(
            render("observation-view", {
                value: "5.9",
                meterValue: 5.9,
                meterMin: 2,
            }).document.querySelector("meter"),
        ).toBeNull();
        expect(
            render("observation-view", {
                status: "unavailable",
                statusLabel: "Unavailable",
                meterValue: 5.9,
                meterMin: 2,
                meterMax: 8,
            }).document.querySelector("meter"),
        ).toBeNull();
    });
});
