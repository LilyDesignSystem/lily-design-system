import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HrvatskaOsobniIdentifikacijskiBrojView";

describe("HrvatskaOsobniIdentifikacijskiBrojView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Personal Identification Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".hrvatska-osobni-identifikacijski-broj-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hrvatska-osobni-identifikacijski-broj-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Personal Identification Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".hrvatska-osobni-identifikacijski-broj-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Personal Identification Number" />);

        const el = document.querySelector(
            ".hrvatska-osobni-identifikacijski-broj-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Personal Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
