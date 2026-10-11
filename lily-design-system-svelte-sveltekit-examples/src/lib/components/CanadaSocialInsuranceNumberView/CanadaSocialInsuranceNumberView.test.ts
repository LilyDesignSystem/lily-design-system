import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CanadaSocialInsuranceNumberView.svelte";

describe("CanadaSocialInsuranceNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Social Insurance Number (SIN)", value: "test-value" } });

        const el = screen.getByLabelText("Social Insurance Number (SIN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("canada-social-insurance-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Social Insurance Number (SIN)", value: "test-value" } });

        const el = screen.getByLabelText("Social Insurance Number (SIN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Social Insurance Number (SIN)" } });

        const el = screen.getByLabelText("Social Insurance Number (SIN)");
        expect(el.getAttribute("aria-label")).toBe("Social Insurance Number (SIN)");
    });
});
