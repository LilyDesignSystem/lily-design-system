import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ItyopyaFaydaIdentificationNumberView.svelte";

describe("ItyopyaFaydaIdentificationNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Fayda Identification Number (FIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".ityopya-fayda-identification-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ityopya-fayda-identification-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Fayda Identification Number (FIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".ityopya-fayda-identification-number-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Fayda Identification Number (FIN)" } });

        const el = document.querySelector(
            ".ityopya-fayda-identification-number-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Fayda Identification Number (FIN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
