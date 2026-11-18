import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MexicoClaveUnicaDeRegistroDePoblacionView.vue";

describe("MexicoClaveUnicaDeRegistroDePoblacionView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Mexico Clave Unica De Registro De Poblacion", value: "test-value" },
        });

        const el = document.querySelector(
            ".mexico-clave-unica-de-registro-de-poblacion-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "mexico-clave-unica-de-registro-de-poblacion-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Mexico Clave Unica De Registro De Poblacion", value: "test-value" },
        });

        const el = document.querySelector(
            ".mexico-clave-unica-de-registro-de-poblacion-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Mexico Clave Unica De Registro De Poblacion" } });

        const el = document.querySelector(
            ".mexico-clave-unica-de-registro-de-poblacion-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Mexico Clave Unica De Registro De Poblacion"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
