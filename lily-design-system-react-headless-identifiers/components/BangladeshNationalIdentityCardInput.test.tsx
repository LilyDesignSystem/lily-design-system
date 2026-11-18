import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BangladeshNationalIdentityCardInput";

describe("BangladeshNationalIdentityCardInput", () => {
    test("renders a text input", () => {
        render(<Subject label="National ID (NID) number" />);

        const input = screen.getByLabelText("National ID (NID) number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="National ID (NID) number" />);

        const input = screen.getByLabelText("National ID (NID) number");
        expect(input.getAttribute("class")).toContain("bangladesh-national-identity-card-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="National ID (NID) number" />);

        const input = screen.getByLabelText("National ID (NID) number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="National ID (NID) number" />);

        const input = screen.getByLabelText("National ID (NID) number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="National ID (NID) number"
                required
            />,
        );

        const input = screen.getByLabelText("National ID (NID) number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="National ID (NID) number" />);

        const input = screen.getByLabelText("National ID (NID) number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="National ID (NID) number"
                disabled
            />,
        );

        const input = screen.getByLabelText("National ID (NID) number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="National ID (NID) number"
                data-testid="subject"
            />,
        );

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
