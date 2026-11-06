import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BelgiqueNumeroDeRegistreNationalView";

describe("BelgiqueNumeroDeRegistreNationalView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National Register Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".belgique-numero-de-registre-national-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("belgique-numero-de-registre-national-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National Register Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".belgique-numero-de-registre-national-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Register Number" />);

        const el = document.querySelector(
            ".belgique-numero-de-registre-national-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Register Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
