import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PeruDocumentoNacionalDeIdentidadView";

describe("PeruDocumentoNacionalDeIdentidadView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Documento Nacional de Identidad (DNI)"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".peru-documento-nacional-de-identidad-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("peru-documento-nacional-de-identidad-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Documento Nacional de Identidad (DNI)"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".peru-documento-nacional-de-identidad-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Documento Nacional de Identidad (DNI)" />);

        const el = document.querySelector(
            ".peru-documento-nacional-de-identidad-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Documento Nacional de Identidad (DNI)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
