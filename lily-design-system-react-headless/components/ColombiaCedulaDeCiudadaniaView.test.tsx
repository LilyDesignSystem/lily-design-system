import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ColombiaCedulaDeCiudadaniaView";

describe("ColombiaCedulaDeCiudadaniaView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Cedula de Ciudadania Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".colombia-cedula-de-ciudadania-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("colombia-cedula-de-ciudadania-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Cedula de Ciudadania Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".colombia-cedula-de-ciudadania-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Cedula de Ciudadania Number" />);

        const el = document.querySelector(".colombia-cedula-de-ciudadania-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Cedula de Ciudadania Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
