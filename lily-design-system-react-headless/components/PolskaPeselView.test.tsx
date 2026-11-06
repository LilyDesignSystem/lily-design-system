import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PolskaPeselView";

describe("PolskaPeselView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="PESEL"
                value="test-value"
            />,
        );

        const el = document.querySelector(".polska-pesel-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("polska-pesel-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="PESEL"
                value="test-value"
            />,
        );

        const el = document.querySelector(".polska-pesel-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="PESEL" />);

        const el = document.querySelector(".polska-pesel-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"PESEL"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
