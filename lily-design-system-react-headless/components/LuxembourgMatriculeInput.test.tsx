import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LuxembourgMatriculeInput";

describe("LuxembourgMatriculeInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Matricule National" />);

        const input = screen.getByLabelText("Matricule National") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Matricule National" />);

        const input = screen.getByLabelText("Matricule National");
        expect(input.getAttribute("class")).toContain("luxembourg-matricule-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Matricule National" />);

        const input = screen.getByLabelText("Matricule National");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Matricule National" />);

        const input = screen.getByLabelText("Matricule National") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Matricule National" required />);

        const input = screen.getByLabelText("Matricule National") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Matricule National" />);

        const input = screen.getByLabelText("Matricule National") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Matricule National" disabled />);

        const input = screen.getByLabelText("Matricule National") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Matricule National" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
