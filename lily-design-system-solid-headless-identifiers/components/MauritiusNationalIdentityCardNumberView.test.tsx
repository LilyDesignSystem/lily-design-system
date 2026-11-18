import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./MauritiusNationalIdentityCardNumberView";

describe("MauritiusNationalIdentityCardNumberView", () => {
    test("renders with the correct class", () => {
        render(() => (
            <Subject
                label="National Identity Card number"
                value="test-value"
            />
        ));

        const el = document.querySelector(
            ".mauritius-national-identity-card-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mauritius-national-identity-card-number-view");
    });

    test("renders the value as text content", () => {
        render(() => (
            <Subject
                label="National Identity Card number"
                value="test-value"
            />
        ));

        const el = document.querySelector(
            ".mauritius-national-identity-card-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(() => <Subject label="National Identity Card number" />);

        const el = document.querySelector(
            ".mauritius-national-identity-card-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identity Card number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
