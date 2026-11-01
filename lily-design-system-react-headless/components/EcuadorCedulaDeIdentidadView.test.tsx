import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EcuadorCedulaDeIdentidadView";

describe("EcuadorCedulaDeIdentidadView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Cedula de Identidad Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Cedula de Identidad Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ecuador-cedula-de-identidad-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Cedula de Identidad Number"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Cedula de Identidad Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Cedula de Identidad Number" />);

        const el = screen.getByLabelText("Cedula de Identidad Number");
        expect(el.getAttribute("aria-label")).toBe("Cedula de Identidad Number");
    });
});
