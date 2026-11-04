import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./IbanView.vue";

describe("IbanView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "IBAN", value: "test-value" } });

        const el = screen.getByLabelText("IBAN");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("iban-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "IBAN", value: "test-value" } });

        const el = screen.getByLabelText("IBAN");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "IBAN" } });

        const el = screen.getByLabelText("IBAN");
        expect(el.getAttribute("aria-label")).toBe("IBAN");
    });
});
