import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./PilipinasPhilhealthIdentificationNumberView.vue";

describe("PilipinasPhilhealthIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Pilipinas Philhealth Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Pilipinas Philhealth Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("pilipinas-philhealth-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Pilipinas Philhealth Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Pilipinas Philhealth Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Pilipinas Philhealth Identification Number" } });

        const el = screen.getByLabelText("Pilipinas Philhealth Identification Number");
        expect(el.getAttribute("aria-label")).toBe("Pilipinas Philhealth Identification Number");
    });
});
