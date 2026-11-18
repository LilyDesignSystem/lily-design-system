import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView.vue";

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identification Number", value: "test-value" },
        });

        const el = document.querySelector(
            ".ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identification Number" } });

        const el = document.querySelector(
            ".ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identification Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
