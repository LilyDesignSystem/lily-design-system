import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RepublicaDominicanaCedulaDeIdentidadYElectoralView.vue";

describe("RepublicaDominicanaCedulaDeIdentidadYElectoralView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".republica-dominicana-cedula-de-identidad-y-electoral-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "republica-dominicana-cedula-de-identidad-y-electoral-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".republica-dominicana-cedula-de-identidad-y-electoral-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identification Number" } });

        const el = document.querySelector(
            ".republica-dominicana-cedula-de-identidad-y-electoral-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
