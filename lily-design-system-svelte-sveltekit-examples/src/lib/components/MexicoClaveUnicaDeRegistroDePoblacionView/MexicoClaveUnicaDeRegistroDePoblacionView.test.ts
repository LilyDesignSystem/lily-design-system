import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MexicoClaveUnicaDeRegistroDePoblacionView.svelte";

describe("MexicoClaveUnicaDeRegistroDePoblacionView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Clave Única de Registro de Población (CURP)", value: "test-value" } });

        const el = screen.getByLabelText("Clave Única de Registro de Población (CURP)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mexico-clave-unica-de-registro-de-poblacion-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Clave Única de Registro de Población (CURP)", value: "test-value" } });

        const el = screen.getByLabelText("Clave Única de Registro de Población (CURP)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Clave Única de Registro de Población (CURP)" } });

        const el = screen.getByLabelText("Clave Única de Registro de Población (CURP)");
        expect(el.getAttribute("aria-label")).toBe("Clave Única de Registro de Población (CURP)");
    });
});
