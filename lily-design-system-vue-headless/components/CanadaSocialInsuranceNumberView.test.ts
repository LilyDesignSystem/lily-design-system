import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CanadaSocialInsuranceNumberView.vue";

describe("CanadaSocialInsuranceNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("Canada Social Insurance Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("canada-social-insurance-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("Canada Social Insurance Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number" } });

        const el = screen.getByLabelText("Canada Social Insurance Number");
        expect(el.getAttribute("aria-label")).toBe("Canada Social Insurance Number");
    });
});
