import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./GuatemalaCodigoUnicoDeIdentificacionView";

describe("GuatemalaCodigoUnicoDeIdentificacionView", () => {
    test("renders with the correct class", () => {
        render(() => (
            <Subject
                label="Código Único de Identificación (CUI)"
                value="test-value"
            />
        ));

        const el = document.querySelector(
            ".guatemala-codigo-unico-de-identificacion-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("guatemala-codigo-unico-de-identificacion-view");
    });

    test("renders the value as text content", () => {
        render(() => (
            <Subject
                label="Código Único de Identificación (CUI)"
                value="test-value"
            />
        ));

        const el = document.querySelector(
            ".guatemala-codigo-unico-de-identificacion-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(() => <Subject label="Código Único de Identificación (CUI)" />);

        const el = document.querySelector(
            ".guatemala-codigo-unico-de-identificacion-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Código Único de Identificación (CUI)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
