import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ItyopyaFaydaIdentificationNumberInput";

describe("ItyopyaFaydaIdentificationNumberInput", () => {
    test("renders a text input", () => {
        render(() => <Subject label="Fayda Identification Number (FIN)" />);

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(() => <Subject label="Fayda Identification Number (FIN)" />);

        const input = screen.getByLabelText("Fayda Identification Number (FIN)");
        expect(input.getAttribute("class")).toContain("ityopya-fayda-identification-number-input");
    });

    test("has autocomplete off", () => {
        render(() => <Subject label="Fayda Identification Number (FIN)" />);

        const input = screen.getByLabelText("Fayda Identification Number (FIN)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(() => <Subject label="Fayda Identification Number (FIN)" />);

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(() => (
            <Subject
                label="Fayda Identification Number (FIN)"
                required
            />
        ));

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(() => <Subject label="Fayda Identification Number (FIN)" />);

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(() => (
            <Subject
                label="Fayda Identification Number (FIN)"
                disabled
            />
        ));

        const input = screen.getByLabelText(
            "Fayda Identification Number (FIN)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(() => (
            <Subject
                label="Fayda Identification Number (FIN)"
                data-testid="subject"
            />
        ));

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
