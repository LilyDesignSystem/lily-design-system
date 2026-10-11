import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SingaporeNationalRegistrationIdentityCardView.svelte";

describe("SingaporeNationalRegistrationIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)", value: "test-value" } });

        const el = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("singapore-national-registration-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)", value: "test-value" } });

        const el = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" } });

        const el = screen.getByLabelText("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
        expect(el.getAttribute("aria-label")).toBe("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
    });
});
