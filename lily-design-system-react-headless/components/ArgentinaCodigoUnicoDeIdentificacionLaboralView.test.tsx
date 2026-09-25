import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" value="test-value" />);

        const el = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" value="test-value" />);

        const el = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Código Único de Identificación Laboral (CUIL)" />);

        const el = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(el.getAttribute("aria-label")).toBe("Código Único de Identificación Laboral (CUIL)");
    });
});
