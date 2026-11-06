import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ElladaDematerialisedSecuritiesSystemView";

describe("ElladaDematerialisedSecuritiesSystemView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Dematerialised Securities System"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".ellada-dematerialised-securities-system-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ellada-dematerialised-securities-system-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Dematerialised Securities System"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".ellada-dematerialised-securities-system-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Dematerialised Securities System" />);

        const el = document.querySelector(
            ".ellada-dematerialised-securities-system-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Dematerialised Securities System"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
