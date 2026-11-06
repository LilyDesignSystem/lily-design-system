import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LietuvaPasasView";

describe("LietuvaPasasView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Lithuanian Passport"
                value="test-value"
            />,
        );

        const el = document.querySelector(".lietuva-pasas-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("lietuva-pasas-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Lithuanian Passport"
                value="test-value"
            />,
        );

        const el = document.querySelector(".lietuva-pasas-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Lithuanian Passport" />);

        const el = document.querySelector(".lietuva-pasas-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Lithuanian Passport"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
