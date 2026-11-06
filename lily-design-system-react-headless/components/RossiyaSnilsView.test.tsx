import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RossiyaSnilsView";

describe("RossiyaSnilsView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="SNILS (СНИЛС)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".rossiya-snils-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="SNILS (СНИЛС)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".rossiya-snils-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="SNILS (СНИЛС)" />);

        const el = document.querySelector(".rossiya-snils-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"SNILS (СНИЛС)"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
