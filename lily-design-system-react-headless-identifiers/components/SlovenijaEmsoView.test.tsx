import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SlovenijaEmsoView";

describe("SlovenijaEmsoView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Unique Master Citizen Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".slovenija-emso-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slovenija-emso-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Unique Master Citizen Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(".slovenija-emso-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Unique Master Citizen Number" />);

        const el = document.querySelector(".slovenija-emso-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Unique Master Citizen Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
