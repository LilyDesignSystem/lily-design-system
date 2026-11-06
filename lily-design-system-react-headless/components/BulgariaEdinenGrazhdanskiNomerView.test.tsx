import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BulgariaEdinenGrazhdanskiNomerView";

describe("BulgariaEdinenGrazhdanskiNomerView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Uniform Civil Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".bulgaria-edinen-grazhdanski-nomer-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bulgaria-edinen-grazhdanski-nomer-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Uniform Civil Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".bulgaria-edinen-grazhdanski-nomer-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Uniform Civil Number" />);

        const el = document.querySelector(".bulgaria-edinen-grazhdanski-nomer-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Uniform Civil Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
