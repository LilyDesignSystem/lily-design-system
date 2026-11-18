import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./YisraelTeudatZehutView";

describe("YisraelTeudatZehutView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Teudat Zehut (תעודת זהות)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".yisrael-teudat-zehut-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("yisrael-teudat-zehut-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Teudat Zehut (תעודת זהות)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".yisrael-teudat-zehut-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Teudat Zehut (תעודת זהות)" />);

        const el = document.querySelector(".yisrael-teudat-zehut-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Teudat Zehut (תעודת זהות)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
