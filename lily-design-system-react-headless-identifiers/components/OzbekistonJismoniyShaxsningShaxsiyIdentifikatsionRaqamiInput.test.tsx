import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput";

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Personal identification number (JShShIR / PINFL)" />);

        const input = screen.getByLabelText(
            "Personal identification number (JShShIR / PINFL)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Personal identification number (JShShIR / PINFL)" />);

        const input = screen.getByLabelText("Personal identification number (JShShIR / PINFL)");
        expect(input.getAttribute("class")).toContain(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
        );
    });

    test("has autocomplete off", () => {
        render(<Subject label="Personal identification number (JShShIR / PINFL)" />);

        const input = screen.getByLabelText("Personal identification number (JShShIR / PINFL)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Personal identification number (JShShIR / PINFL)" />);

        const input = screen.getByLabelText(
            "Personal identification number (JShShIR / PINFL)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="Personal identification number (JShShIR / PINFL)"
                required
            />,
        );

        const input = screen.getByLabelText(
            "Personal identification number (JShShIR / PINFL)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Personal identification number (JShShIR / PINFL)" />);

        const input = screen.getByLabelText(
            "Personal identification number (JShShIR / PINFL)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="Personal identification number (JShShIR / PINFL)"
                disabled
            />,
        );

        const input = screen.getByLabelText(
            "Personal identification number (JShShIR / PINFL)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Personal identification number (JShShIR / PINFL)"
                data-testid="subject"
            />,
        );

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
