import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./AotearoaNationalHealthIndexView.vue";

describe("AotearoaNationalHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Aotearoa National Health Index", value: "test-value" },
        });

        const el = document.querySelector(".aotearoa-national-health-index-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("aotearoa-national-health-index-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Aotearoa National Health Index", value: "test-value" },
        });

        const el = document.querySelector(".aotearoa-national-health-index-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Aotearoa National Health Index" } });

        const el = document.querySelector(".aotearoa-national-health-index-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Aotearoa National Health Index"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
