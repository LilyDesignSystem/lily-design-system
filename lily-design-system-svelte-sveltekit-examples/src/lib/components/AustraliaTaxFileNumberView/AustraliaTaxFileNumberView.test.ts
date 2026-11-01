import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AustraliaTaxFileNumberView.svelte";

describe("AustraliaTaxFileNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", value: "test-value" } });

        const el = screen.getByLabelText("Tax File Number (TFN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("australia-tax-file-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)", value: "test-value" } });

        const el = screen.getByLabelText("Tax File Number (TFN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Tax File Number (TFN)" } });

        const el = screen.getByLabelText("Tax File Number (TFN)");
        expect(el.getAttribute("aria-label")).toBe("Tax File Number (TFN)");
    });
});
