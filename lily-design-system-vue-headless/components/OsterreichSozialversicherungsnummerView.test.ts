import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./OsterreichSozialversicherungsnummerView.vue";

describe("OsterreichSozialversicherungsnummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Social Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("Social Insurance Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("osterreich-sozialversicherungsnummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Social Insurance Number", value: "test-value" } });

        const el = screen.getByLabelText("Social Insurance Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Social Insurance Number" } });

        const el = screen.getByLabelText("Social Insurance Number");
        expect(el.getAttribute("aria-label")).toBe("Social Insurance Number");
    });
});
