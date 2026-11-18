import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./CostaRicaCedulaDeIdentidadView";

describe("CostaRicaCedulaDeIdentidadView", () => {
    test("renders with the correct class", () => {
        render(() => (
            <Subject
                label="Cédula de Identidad"
                value="test-value"
            />
        ));

        const el = document.querySelector(".costa-rica-cedula-de-identidad-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("costa-rica-cedula-de-identidad-view");
    });

    test("renders the value as text content", () => {
        render(() => (
            <Subject
                label="Cédula de Identidad"
                value="test-value"
            />
        ));

        const el = document.querySelector(".costa-rica-cedula-de-identidad-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(() => <Subject label="Cédula de Identidad" />);

        const el = document.querySelector(".costa-rica-cedula-de-identidad-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Cédula de Identidad"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
