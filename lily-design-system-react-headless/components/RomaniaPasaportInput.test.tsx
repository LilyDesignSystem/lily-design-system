import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RomaniaPasaportInput";

describe("RomaniaPasaportInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Romanian Passport" />);

        const input = screen.getByLabelText("Romanian Passport") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Romanian Passport" />);

        const input = screen.getByLabelText("Romanian Passport");
        expect(input.getAttribute("class")).toContain("romania-pasaport-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Romanian Passport" />);

        const input = screen.getByLabelText("Romanian Passport");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Romanian Passport" />);

        const input = screen.getByLabelText("Romanian Passport") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Romanian Passport" required />);

        const input = screen.getByLabelText("Romanian Passport") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Romanian Passport" />);

        const input = screen.getByLabelText("Romanian Passport") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Romanian Passport" disabled />);

        const input = screen.getByLabelText("Romanian Passport") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Romanian Passport" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
