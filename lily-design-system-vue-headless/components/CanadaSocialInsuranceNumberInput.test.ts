import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CanadaSocialInsuranceNumberInput.vue";

describe("CanadaSocialInsuranceNumberInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number" } });

        const input = screen.getByLabelText("Canada Social Insurance Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number" } });

        const input = screen.getByLabelText("Canada Social Insurance Number");
        expect(input.getAttribute("class")).toContain("canada-social-insurance-number-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number" } });

        const input = screen.getByLabelText("Canada Social Insurance Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number" } });

        const input = screen.getByLabelText("Canada Social Insurance Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number", required: true } });

        const input = screen.getByLabelText("Canada Social Insurance Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number" } });

        const input = screen.getByLabelText("Canada Social Insurance Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number", disabled: true } });

        const input = screen.getByLabelText("Canada Social Insurance Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Canada Social Insurance Number", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
