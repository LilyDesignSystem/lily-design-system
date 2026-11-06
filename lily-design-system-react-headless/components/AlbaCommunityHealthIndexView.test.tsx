import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AlbaCommunityHealthIndexView";

describe("AlbaCommunityHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Community Health Index"
                value="test-value"
            />,
        );

        const el = document.querySelector(".alba-community-health-index-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("alba-community-health-index-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Community Health Index"
                value="test-value"
            />,
        );

        const el = document.querySelector(".alba-community-health-index-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Community Health Index" />);

        const el = document.querySelector(".alba-community-health-index-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Community Health Index"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
