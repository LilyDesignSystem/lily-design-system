import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SingaporeNationalRegistrationIdentityCardInput.vue";

describe("SingaporeNationalRegistrationIdentityCardInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card");
        expect(input.getAttribute("class")).toContain("singapore-national-registration-identity-card-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card", required: true } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card", disabled: true } });

        const input = screen.getByLabelText("Singapore National Registration Identity Card") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
