import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AlImaratRaqmAlHuwiyahView.svelte";

describe("AlImaratRaqmAlHuwiyahView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Emirates ID number", value: "test-value" },
        });

        const el = document.querySelector(".al-imarat-raqm-al-huwiyah-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("al-imarat-raqm-al-huwiyah-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Emirates ID number", value: "test-value" },
        });

        const el = document.querySelector(".al-imarat-raqm-al-huwiyah-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Emirates ID number" } });

        const el = document.querySelector(".al-imarat-raqm-al-huwiyah-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Emirates ID number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
