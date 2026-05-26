import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EspanaCodigoDeIdentificacionFiscalView";

describe("EspanaCodigoDeIdentificacionFiscalView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Tax Identification Code" value="test-value" />);

        const el = screen.getByLabelText("Tax Identification Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("espana-codigo-de-identificacion-fiscal-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Tax Identification Code" value="test-value" />);

        const el = screen.getByLabelText("Tax Identification Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Tax Identification Code" />);

        const el = screen.getByLabelText("Tax Identification Code");
        expect(el.getAttribute("aria-label")).toBe("Tax Identification Code");
    });
});
