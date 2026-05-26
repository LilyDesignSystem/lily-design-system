import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LietuvaAsmensKodasInput";

describe("LietuvaAsmensKodasInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Personal Code" />);

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Personal Code" />);

        const input = screen.getByLabelText("Personal Code");
        expect(input.getAttribute("class")).toContain("lietuva-asmens-kodas-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Personal Code" />);

        const input = screen.getByLabelText("Personal Code");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Personal Code" />);

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Personal Code" required />);

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Personal Code" />);

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Personal Code" disabled />);

        const input = screen.getByLabelText("Personal Code") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Personal Code" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
