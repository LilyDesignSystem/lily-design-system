import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SverigePersonnummerView";

describe("SverigePersonnummerView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Personal Identity Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".sverige-personnummer-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("sverige-personnummer-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Personal Identity Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".sverige-personnummer-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Personal Identity Number" />);

        const el = document.querySelector(".sverige-personnummer-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Personal Identity Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
