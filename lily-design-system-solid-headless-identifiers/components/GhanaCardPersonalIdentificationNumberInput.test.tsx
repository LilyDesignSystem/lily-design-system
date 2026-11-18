import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./GhanaCardPersonalIdentificationNumberInput";

describe("GhanaCardPersonalIdentificationNumberInput", () => {
    test("renders a text input", () => {
        render(() => <Subject label="Ghana Card PIN" />);

        const input = screen.getByLabelText("Ghana Card PIN") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(() => <Subject label="Ghana Card PIN" />);

        const input = screen.getByLabelText("Ghana Card PIN");
        expect(input.getAttribute("class")).toContain(
            "ghana-card-personal-identification-number-input",
        );
    });

    test("has autocomplete off", () => {
        render(() => <Subject label="Ghana Card PIN" />);

        const input = screen.getByLabelText("Ghana Card PIN");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(() => <Subject label="Ghana Card PIN" />);

        const input = screen.getByLabelText("Ghana Card PIN") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(() => (
            <Subject
                label="Ghana Card PIN"
                required
            />
        ));

        const input = screen.getByLabelText("Ghana Card PIN") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(() => <Subject label="Ghana Card PIN" />);

        const input = screen.getByLabelText("Ghana Card PIN") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(() => (
            <Subject
                label="Ghana Card PIN"
                disabled
            />
        ));

        const input = screen.getByLabelText("Ghana Card PIN") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(() => (
            <Subject
                label="Ghana Card PIN"
                data-testid="subject"
            />
        ));

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
