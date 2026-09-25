import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SouthAfricaIdentityNumberView.vue";

describe("SouthAfricaIdentityNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "South Africa Identity Number", value: "test-value" } });

        const el = screen.getByLabelText("South Africa Identity Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("south-africa-identity-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "South Africa Identity Number", value: "test-value" } });

        const el = screen.getByLabelText("South Africa Identity Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "South Africa Identity Number" } });

        const el = screen.getByLabelText("South Africa Identity Number");
        expect(el.getAttribute("aria-label")).toBe("South Africa Identity Number");
    });
});
