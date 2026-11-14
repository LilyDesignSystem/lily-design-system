import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("early-warning-score-view", () => {
    it("renders system, score, band and escalation", () => {
        const { document } = render("early-warning-score-view", {
            system: "NEWS2",
            score: 7,
            band: "high",
            bandLabel: "High",
            escalation: "Urgent response",
        });
        const root = document.querySelector("span.early-warning-score-view");
        expect(root.getAttribute("data-band")).toBe("high");
        expect(root.querySelector(".early-warning-score-view-system").textContent).toBe("NEWS2");
        expect(root.querySelector(".early-warning-score-view-score").textContent).toBe("7");
        expect(root.querySelector(".early-warning-score-view-band").textContent).toBe("High");
        expect(root.querySelector(".early-warning-score-view-escalation").textContent).toBe(
            "Urgent response",
        );
    });
});
