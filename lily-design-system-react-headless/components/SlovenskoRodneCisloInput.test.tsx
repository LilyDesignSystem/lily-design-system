import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenskoRodneCisloInput";

describe("SlovenskoRodneCisloInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Slovak Personal Number" />);

        const input = screen.getByLabelText("Slovak Personal Number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Slovak Personal Number" />);

        const input = screen.getByLabelText("Slovak Personal Number");
        expect(input.getAttribute("class")).toContain("slovensko-rodne-cislo-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Slovak Personal Number" />);

        const input = screen.getByLabelText("Slovak Personal Number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Slovak Personal Number" />);

        const input = screen.getByLabelText("Slovak Personal Number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Slovak Personal Number" required />);

        const input = screen.getByLabelText("Slovak Personal Number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Slovak Personal Number" />);

        const input = screen.getByLabelText("Slovak Personal Number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Slovak Personal Number" disabled />);

        const input = screen.getByLabelText("Slovak Personal Number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Slovak Personal Number" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
