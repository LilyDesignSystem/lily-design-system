import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RossiyaSnilsView.vue";

describe("RossiyaSnilsView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Individual Insurance Account Number", value: "test-value" },
        });

        const el = document.querySelector(".rossiya-snils-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("rossiya-snils-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Individual Insurance Account Number", value: "test-value" },
        });

        const el = document.querySelector(".rossiya-snils-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Individual Insurance Account Number" } });

        const el = document.querySelector(".rossiya-snils-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Individual Insurance Account Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
