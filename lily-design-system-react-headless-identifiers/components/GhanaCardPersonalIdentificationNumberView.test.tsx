import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./GhanaCardPersonalIdentificationNumberView";

describe("GhanaCardPersonalIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Ghana Card PIN"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".ghana-card-personal-identification-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "ghana-card-personal-identification-number-view",
        );
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Ghana Card PIN"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".ghana-card-personal-identification-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Ghana Card PIN" />);

        const el = document.querySelector(
            ".ghana-card-personal-identification-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Ghana Card PIN"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
