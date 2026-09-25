import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SingaporeNationalRegistrationIdentityCardView.vue";

describe("SingaporeNationalRegistrationIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card", value: "test-value" } });

        const el = screen.getByLabelText("Singapore National Registration Identity Card");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("singapore-national-registration-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card", value: "test-value" } });

        const el = screen.getByLabelText("Singapore National Registration Identity Card");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const el = screen.getByLabelText("Singapore National Registration Identity Card");
        expect(el.getAttribute("aria-label")).toBe("Singapore National Registration Identity Card");
    });
});
