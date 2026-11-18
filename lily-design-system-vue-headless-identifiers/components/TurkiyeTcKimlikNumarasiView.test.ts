import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TurkiyeTcKimlikNumarasiView.vue";

describe("TurkiyeTcKimlikNumarasiView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "National Identity Number", value: "test-value" } });

        const el = document.querySelector(".turkiye-tc-kimlik-numarasi-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("turkiye-tc-kimlik-numarasi-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "National Identity Number", value: "test-value" } });

        const el = document.querySelector(".turkiye-tc-kimlik-numarasi-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identity Number" } });

        const el = document.querySelector(".turkiye-tc-kimlik-numarasi-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identity Number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
