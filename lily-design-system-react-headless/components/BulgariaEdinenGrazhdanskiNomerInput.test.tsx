import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BulgariaEdinenGrazhdanskiNomerInput";

describe("BulgariaEdinenGrazhdanskiNomerInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Uniform Civil Number" />);

        const input = screen.getByLabelText("Uniform Civil Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Uniform Civil Number" />);

        const input = screen.getByLabelText("Uniform Civil Number");
        expect(input.getAttribute("class")).toContain("bulgaria-edinen-grazhdanski-nomer-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Uniform Civil Number" />);

        const input = screen.getByLabelText("Uniform Civil Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Uniform Civil Number" />);

        const input = screen.getByLabelText("Uniform Civil Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Uniform Civil Number" required />);

        const input = screen.getByLabelText("Uniform Civil Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Uniform Civil Number" />);

        const input = screen.getByLabelText("Uniform Civil Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Uniform Civil Number" disabled />);

        const input = screen.getByLabelText("Uniform Civil Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Uniform Civil Number" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
