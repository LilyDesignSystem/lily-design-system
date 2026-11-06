import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenskoPasView";

describe("SlovenskoPasView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Slovak Passport"
                value="test-value"
            />,
        );

        const el = document.querySelector(".slovensko-pas-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slovensko-pas-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Slovak Passport"
                value="test-value"
            />,
        );

        const el = document.querySelector(".slovensko-pas-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Slovak Passport" />);

        const el = document.querySelector(".slovensko-pas-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Slovak Passport"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
