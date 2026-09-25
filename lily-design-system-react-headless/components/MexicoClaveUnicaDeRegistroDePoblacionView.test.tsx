import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MexicoClaveUnicaDeRegistroDePoblacionView";

describe("MexicoClaveUnicaDeRegistroDePoblacionView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Clave Única de Registro de Población (CURP)" value="test-value" />);

        const el = screen.getByLabelText("Clave Única de Registro de Población (CURP)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mexico-clave-unica-de-registro-de-poblacion-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Clave Única de Registro de Población (CURP)" value="test-value" />);

        const el = screen.getByLabelText("Clave Única de Registro de Población (CURP)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Clave Única de Registro de Población (CURP)" />);

        const el = screen.getByLabelText("Clave Única de Registro de Población (CURP)");
        expect(el.getAttribute("aria-label")).toBe("Clave Única de Registro de Población (CURP)");
    });
});
