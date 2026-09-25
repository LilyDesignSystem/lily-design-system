import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralInput";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(input.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" required />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" disabled />);

        const input = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
