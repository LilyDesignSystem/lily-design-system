import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EestiIsikukoodView";

describe("EestiIsikukoodView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Personal Identification Code"
                value="test-value"
            />,
        );

        const el = document.querySelector(".eesti-isikukood-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("eesti-isikukood-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Personal Identification Code"
                value="test-value"
            />,
        );

        const el = document.querySelector(".eesti-isikukood-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Personal Identification Code" />);

        const el = document.querySelector(".eesti-isikukood-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Personal Identification Code"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
