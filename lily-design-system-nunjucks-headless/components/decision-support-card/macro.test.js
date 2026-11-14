import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

const base = {
    summary: "Penicillin allergy recorded",
    indicator: "critical",
    indicatorLabel: "Critical",
    sourceLabel: "Local formulary",
};

describe("decision-support-card", () => {
    it("renders a group named by its summary, not a live region", () => {
        const { document } = render("decision-support-card", base);
        const card = document.querySelector(".decision-support-card");
        expect(card.getAttribute("role")).toBe("group");
        expect(card.getAttribute("aria-label")).toBe("Penicillin allergy recorded");
        expect(card.getAttribute("data-indicator")).toBe("critical");
        expect(card.querySelector(".decision-support-card-indicator").textContent).toBe("Critical");
        expect(card.hasAttribute("aria-live")).toBe(false);
        expect(card.querySelector("form")).toBeNull();
        expect(card.querySelector(".decision-support-card-detail")).toBeNull();
    });

    it("renders the detail, suggestions as buttons and links", () => {
        const { document } = render(
            "decision-support-card",
            {
                ...base,
                suggestions: [{ id: "cancel", label: "Cancel amoxicillin", isRecommended: true }],
                links: [{ label: "Guideline", href: "/guideline" }],
            },
            "<p>Amoxicillin is a penicillin.</p>",
        );
        expect(document.querySelector(".decision-support-card-detail").textContent).toBe(
            "Amoxicillin is a penicillin.",
        );
        const button = document.querySelector("button.decision-support-card-suggestion");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("data-suggestion-id")).toBe("cancel");
        expect(button.getAttribute("data-recommended")).toBe("true");
        expect(document.querySelector(".decision-support-card-links a").getAttribute("href")).toBe(
            "/guideline",
        );
    });

    it("the browser refuses to dismiss without a reason: the select is required", () => {
        const { document } = render("decision-support-card", {
            ...base,
            dismissLabel: "Dismiss",
            overrideReasons: [{ code: "error", display: "Allergy recorded in error" }],
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        });
        const form = document.querySelector("form.decision-support-card-override");
        const select = form.querySelector("select");
        expect(form.hasAttribute("novalidate")).toBe(false);
        expect(select.required).toBe(true);
        expect(form.checkValidity()).toBe(false);
        select.value = "error";
        expect(form.checkValidity()).toBe(true);
    });
});
