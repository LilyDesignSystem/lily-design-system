import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RepublicaDominicanaCedulaDeIdentidadYElectoralView";

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Cédula de Identidad y Electoral"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".republica-dominicana-cedula-de-identidad-y-electoral-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "republica-dominicana-cedula-de-identidad-y-electoral-view",
        );
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Cédula de Identidad y Electoral"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".republica-dominicana-cedula-de-identidad-y-electoral-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Cédula de Identidad y Electoral" />);

        const el = document.querySelector(
            ".republica-dominicana-cedula-de-identidad-y-electoral-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Cédula de Identidad y Electoral"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
