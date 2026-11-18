import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CostaRicaCedulaDeIdentidadInput";

describe("CostaRicaCedulaDeIdentidadInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Cédula de Identidad" />);

        const input = screen.getByLabelText("Cédula de Identidad") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Cédula de Identidad" />);

        const input = screen.getByLabelText("Cédula de Identidad");
        expect(input.getAttribute("class")).toContain("costa-rica-cedula-de-identidad-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Cédula de Identidad" />);

        const input = screen.getByLabelText("Cédula de Identidad");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Cédula de Identidad" />);

        const input = screen.getByLabelText("Cédula de Identidad") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="Cédula de Identidad"
                required
            />,
        );

        const input = screen.getByLabelText("Cédula de Identidad") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Cédula de Identidad" />);

        const input = screen.getByLabelText("Cédula de Identidad") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="Cédula de Identidad"
                disabled
            />,
        );

        const input = screen.getByLabelText("Cédula de Identidad") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Cédula de Identidad"
                data-testid="subject"
            />,
        );

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
