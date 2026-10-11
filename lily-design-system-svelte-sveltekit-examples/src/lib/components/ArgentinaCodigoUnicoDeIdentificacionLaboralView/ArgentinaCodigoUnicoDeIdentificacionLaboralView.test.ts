import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.svelte";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Código Único de Identificación Laboral (CUIL)", value: "test-value" } });

        const el = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Código Único de Identificación Laboral (CUIL)", value: "test-value" } });

        const el = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Código Único de Identificación Laboral (CUIL)" } });

        const el = screen.getByLabelText("Código Único de Identificación Laboral (CUIL)");
        expect(el.getAttribute("aria-label")).toBe("Código Único de Identificación Laboral (CUIL)");
    });
});
