import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NorgeFodselsnummerView";

describe("NorgeFodselsnummerView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Norwegian Birth Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".norge-fodselsnummer-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("norge-fodselsnummer-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Norwegian Birth Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".norge-fodselsnummer-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Norwegian Birth Number" />);

        const el = document.querySelector(".norge-fodselsnummer-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Norwegian Birth Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
