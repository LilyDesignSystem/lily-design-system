import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GuatemalaCodigoUnicoDeIdentificacionInput.svelte";

describe("GuatemalaCodigoUnicoDeIdentificacionInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Código Único de Identificación (CUI)" } });

        const input = screen.getByLabelText(
            "Código Único de Identificación (CUI)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Código Único de Identificación (CUI)" } });

        const input = screen.getByLabelText("Código Único de Identificación (CUI)");
        expect(input.getAttribute("class")).toContain(
            "guatemala-codigo-unico-de-identificacion-input",
        );
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Código Único de Identificación (CUI)" } });

        const input = screen.getByLabelText("Código Único de Identificación (CUI)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Código Único de Identificación (CUI)" } });

        const input = screen.getByLabelText(
            "Código Único de Identificación (CUI)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, {
            props: { label: "Código Único de Identificación (CUI)", required: true },
        });

        const input = screen.getByLabelText(
            "Código Único de Identificación (CUI)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Código Único de Identificación (CUI)" } });

        const input = screen.getByLabelText(
            "Código Único de Identificación (CUI)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, {
            props: { label: "Código Único de Identificación (CUI)", disabled: true },
        });

        const input = screen.getByLabelText(
            "Código Único de Identificación (CUI)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Código Único de Identificación (CUI)", "data-testid": "subject" },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
