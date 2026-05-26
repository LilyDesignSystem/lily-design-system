import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PolskaPeselInput";

describe("PolskaPeselInput", () => {
    test("renders a text input", () => {
        render(<Subject label="PESEL" />);

        const input = screen.getByLabelText("PESEL") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="PESEL" />);

        const input = screen.getByLabelText("PESEL");
        expect(input.getAttribute("class")).toContain("polska-pesel-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="PESEL" />);

        const input = screen.getByLabelText("PESEL");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="PESEL" />);

        const input = screen.getByLabelText("PESEL") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="PESEL" required />);

        const input = screen.getByLabelText("PESEL") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="PESEL" />);

        const input = screen.getByLabelText("PESEL") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="PESEL" disabled />);

        const input = screen.getByLabelText("PESEL") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="PESEL" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
