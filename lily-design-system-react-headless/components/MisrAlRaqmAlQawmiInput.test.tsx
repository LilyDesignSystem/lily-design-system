import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MisrAlRaqmAlQawmiInput";

describe("MisrAlRaqmAlQawmiInput", () => {
    test("renders a text input", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const input = screen.getByLabelText("National Number (الرقم القومي)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const input = screen.getByLabelText("National Number (الرقم القومي)");
        expect(input.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const input = screen.getByLabelText("National Number (الرقم القومي)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const input = screen.getByLabelText("National Number (الرقم القومي)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="National Number (الرقم القومي)" required />);

        const input = screen.getByLabelText("National Number (الرقم القومي)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const input = screen.getByLabelText("National Number (الرقم القومي)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="National Number (الرقم القومي)" disabled />);

        const input = screen.getByLabelText("National Number (الرقم القومي)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="National Number (الرقم القومي)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
