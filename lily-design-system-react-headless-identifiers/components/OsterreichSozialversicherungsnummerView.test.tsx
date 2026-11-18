import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./OsterreichSozialversicherungsnummerView";

describe("OsterreichSozialversicherungsnummerView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Sozialversicherungsnummer (SVNR)"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".osterreich-sozialversicherungsnummer-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("osterreich-sozialversicherungsnummer-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Sozialversicherungsnummer (SVNR)"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".osterreich-sozialversicherungsnummer-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Sozialversicherungsnummer (SVNR)" />);

        const el = document.querySelector(
            ".osterreich-sozialversicherungsnummer-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Sozialversicherungsnummer (SVNR)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
