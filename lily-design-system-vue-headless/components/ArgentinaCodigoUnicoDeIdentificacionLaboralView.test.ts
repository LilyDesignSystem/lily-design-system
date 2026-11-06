import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.vue";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Labor Identification Code", value: "test-value" } });

        const el = document.querySelector(
            ".argentina-codigo-unico-de-identificacion-laboral-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "argentina-codigo-unico-de-identificacion-laboral-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Labor Identification Code", value: "test-value" } });

        const el = document.querySelector(
            ".argentina-codigo-unico-de-identificacion-laboral-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Labor Identification Code" } });

        const el = document.querySelector(
            ".argentina-codigo-unico-de-identificacion-laboral-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Labor Identification Code"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
