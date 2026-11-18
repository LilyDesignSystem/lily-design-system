import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CymruRhifYGwasanaethIechydGwladolView";

describe("CymruRhifYGwasanaethIechydGwladolView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National Health Service Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".cymru-rhif-y-gwasanaeth-iechyd-gwladol-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National Health Service Number"
                value="test-value"
            />,
        );

        const el = document.querySelector(
            ".cymru-rhif-y-gwasanaeth-iechyd-gwladol-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Health Service Number" />);

        const el = document.querySelector(
            ".cymru-rhif-y-gwasanaeth-iechyd-gwladol-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Health Service Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
