import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SchweizAhvNummerInput";

describe("SchweizAhvNummerInput", () => {
    test("renders a text input", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS");
        expect(input.getAttribute("class")).toContain("schweiz-ahv-nummer-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" required />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" disabled />);

        const input = screen.getByLabelText("AHV-Nummer / Numéro AVS") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="AHV-Nummer / Numéro AVS" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
