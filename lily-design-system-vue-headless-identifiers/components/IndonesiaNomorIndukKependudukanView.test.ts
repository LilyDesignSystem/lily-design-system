import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./IndonesiaNomorIndukKependudukanView.vue";

describe("IndonesiaNomorIndukKependudukanView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Population Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".indonesia-nomor-induk-kependudukan-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Population Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".indonesia-nomor-induk-kependudukan-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Population Identification Number" } });

        const el = document.querySelector(
            ".indonesia-nomor-induk-kependudukan-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Population Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
