import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BangladeshNationalIdentityCardView";

describe("BangladeshNationalIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National ID (NID) number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".bangladesh-national-identity-card-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bangladesh-national-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National ID (NID) number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".bangladesh-national-identity-card-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National ID (NID) number" />);

        const el = document.querySelector(".bangladesh-national-identity-card-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National ID (NID) number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
