import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RossiyaSnilsView.vue";

describe("RossiyaSnilsView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Individual Insurance Account Number", value: "test-value" } });

        const el = screen.getByLabelText("Individual Insurance Account Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Individual Insurance Account Number", value: "test-value" } });

        const el = screen.getByLabelText("Individual Insurance Account Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Individual Insurance Account Number" } });

        const el = screen.getByLabelText("Individual Insurance Account Number");
        expect(el.getAttribute("aria-label")).toBe("Individual Insurance Account Number");
    });
});
