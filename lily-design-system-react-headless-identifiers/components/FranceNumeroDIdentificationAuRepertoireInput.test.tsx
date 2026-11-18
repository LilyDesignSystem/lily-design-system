import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./FranceNumeroDIdentificationAuRepertoireInput";

describe("FranceNumeroDIdentificationAuRepertoireInput", () => {
    test("renders a text input", () => {
        render(<Subject label="NIR" />);

        const input = screen.getByLabelText("NIR") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has numeric inputmode", () => {
        render(<Subject label="NIR" />);

        const input = screen.getByLabelText("NIR");
        expect(input.getAttribute("inputmode")).toBe("numeric");
    });

    test("has the correct pattern for NIR format", () => {
        render(<Subject label="NIR" />);

        const input = screen.getByLabelText("NIR");
        expect(input.getAttribute("pattern")).toBe(
            "[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}",
        );
    });

    test("has autocomplete off", () => {
        render(<Subject label="NIR" />);

        const input = screen.getByLabelText("NIR");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="NIR" />);

        const input = screen.getByLabelText("NIR") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="NIR"
                required
            />,
        );

        const input = screen.getByLabelText("NIR") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="NIR" />);

        const input = screen.getByLabelText("NIR") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="NIR"
                disabled
            />,
        );

        const input = screen.getByLabelText("NIR") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="NIR"
                data-testid="nir-input"
            />,
        );

        const input = screen.getByTestId("nir-input");
        expect(input).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(
            <Subject
                label="NIR"
                id="nir-field"
            />,
        );

        const input = screen.getByLabelText("NIR");
        expect(input.getAttribute("id")).toBe("nir-field");
    });
});
