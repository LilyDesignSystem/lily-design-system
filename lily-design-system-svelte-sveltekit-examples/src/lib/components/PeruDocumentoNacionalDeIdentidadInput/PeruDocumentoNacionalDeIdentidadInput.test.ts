import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PeruDocumentoNacionalDeIdentidadInput.svelte";

describe("PeruDocumentoNacionalDeIdentidadInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Documento Nacional de Identidad (DNI)" } });

        const input = screen.getByLabelText(
            "Documento Nacional de Identidad (DNI)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Documento Nacional de Identidad (DNI)" } });

        const input = screen.getByLabelText("Documento Nacional de Identidad (DNI)");
        expect(input.getAttribute("class")).toContain("peru-documento-nacional-de-identidad-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Documento Nacional de Identidad (DNI)" } });

        const input = screen.getByLabelText("Documento Nacional de Identidad (DNI)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Documento Nacional de Identidad (DNI)" } });

        const input = screen.getByLabelText(
            "Documento Nacional de Identidad (DNI)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, {
            props: { label: "Documento Nacional de Identidad (DNI)", required: true },
        });

        const input = screen.getByLabelText(
            "Documento Nacional de Identidad (DNI)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Documento Nacional de Identidad (DNI)" } });

        const input = screen.getByLabelText(
            "Documento Nacional de Identidad (DNI)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, {
            props: { label: "Documento Nacional de Identidad (DNI)", disabled: true },
        });

        const input = screen.getByLabelText(
            "Documento Nacional de Identidad (DNI)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Documento Nacional de Identidad (DNI)", "data-testid": "subject" },
        });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
