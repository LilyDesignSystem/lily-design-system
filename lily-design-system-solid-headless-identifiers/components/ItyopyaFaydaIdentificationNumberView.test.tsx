import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ItyopyaFaydaIdentificationNumberView";

describe("ItyopyaFaydaIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(() => (
            <Subject
                label="Fayda Identification Number (FIN)"
                value="test-value"
            />
        ));

        const el = document.querySelector(
            ".ityopya-fayda-identification-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ityopya-fayda-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(() => (
            <Subject
                label="Fayda Identification Number (FIN)"
                value="test-value"
            />
        ));

        const el = document.querySelector(
            ".ityopya-fayda-identification-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(() => <Subject label="Fayda Identification Number (FIN)" />);

        const el = document.querySelector(
            ".ityopya-fayda-identification-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Fayda Identification Number (FIN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
