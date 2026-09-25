import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BharatAadhaarInput.vue";

describe("BharatAadhaarInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const input = screen.getByLabelText("Bharat Aadhaar") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const input = screen.getByLabelText("Bharat Aadhaar");
        expect(input.getAttribute("class")).toContain("bharat-aadhaar-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const input = screen.getByLabelText("Bharat Aadhaar");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const input = screen.getByLabelText("Bharat Aadhaar") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", required: true } });

        const input = screen.getByLabelText("Bharat Aadhaar") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const input = screen.getByLabelText("Bharat Aadhaar") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", disabled: true } });

        const input = screen.getByLabelText("Bharat Aadhaar") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
