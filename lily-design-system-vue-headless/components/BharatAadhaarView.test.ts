import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BharatAadhaarView.vue";

describe("BharatAadhaarView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", value: "test-value" } });

        const el = screen.getByLabelText("Bharat Aadhaar");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bharat-aadhaar-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", value: "test-value" } });

        const el = screen.getByLabelText("Bharat Aadhaar");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const el = screen.getByLabelText("Bharat Aadhaar");
        expect(el.getAttribute("aria-label")).toBe("Bharat Aadhaar");
    });
});
