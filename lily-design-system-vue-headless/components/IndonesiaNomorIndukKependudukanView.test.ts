import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./IndonesiaNomorIndukKependudukanView.vue";

describe("IndonesiaNomorIndukKependudukanView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Population Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Population Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Population Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Population Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Population Identification Number" } });

        const el = screen.getByLabelText("Population Identification Number");
        expect(el.getAttribute("aria-label")).toBe("Population Identification Number");
    });
});
