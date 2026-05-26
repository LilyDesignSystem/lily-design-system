import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandPaspoortNummerInput";

describe("NederlandPaspoortNummerInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Dutch Passport Number" />);

        const input = screen.getByLabelText("Dutch Passport Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Dutch Passport Number" />);

        const input = screen.getByLabelText("Dutch Passport Number");
        expect(input.getAttribute("class")).toContain("nederland-paspoort-nummer-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Dutch Passport Number" />);

        const input = screen.getByLabelText("Dutch Passport Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Dutch Passport Number" />);

        const input = screen.getByLabelText("Dutch Passport Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Dutch Passport Number" required />);

        const input = screen.getByLabelText("Dutch Passport Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Dutch Passport Number" />);

        const input = screen.getByLabelText("Dutch Passport Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Dutch Passport Number" disabled />);

        const input = screen.getByLabelText("Dutch Passport Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Dutch Passport Number" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
