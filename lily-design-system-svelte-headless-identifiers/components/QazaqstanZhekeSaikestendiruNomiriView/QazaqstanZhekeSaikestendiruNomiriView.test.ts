import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./QazaqstanZhekeSaikestendiruNomiriView.svelte";

describe("QazaqstanZhekeSaikestendiruNomiriView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Individual Identification Number (IIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".qazaqstan-zheke-saikestendiru-nomiri-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("qazaqstan-zheke-saikestendiru-nomiri-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Individual Identification Number (IIN)", value: "test-value" },
        });

        const el = document.querySelector(
            ".qazaqstan-zheke-saikestendiru-nomiri-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Individual Identification Number (IIN)" } });

        const el = document.querySelector(
            ".qazaqstan-zheke-saikestendiru-nomiri-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Individual Identification Number (IIN)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
