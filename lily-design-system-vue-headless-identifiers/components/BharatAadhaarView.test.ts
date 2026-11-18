import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BharatAadhaarView.vue";

describe("BharatAadhaarView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", value: "test-value" } });

        const el = document.querySelector(".bharat-aadhaar-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bharat-aadhaar-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Bharat Aadhaar", value: "test-value" } });

        const el = document.querySelector(".bharat-aadhaar-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Bharat Aadhaar" } });

        const el = document.querySelector(".bharat-aadhaar-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Bharat Aadhaar"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
