import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MagyarorszagTajSzamView.vue";

describe("MagyarorszagTajSzamView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Health Insurance Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Health Insurance Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("magyarorszag-taj-szam-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Health Insurance Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Health Insurance Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Health Insurance Identification Number" } });

        const el = screen.getByLabelText("Health Insurance Identification Number");
        expect(el.getAttribute("aria-label")).toBe("Health Insurance Identification Number");
    });
});
