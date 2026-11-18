import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./NihonKojinBangoView.vue";

describe("NihonKojinBangoView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Nihon Kojin Bango", value: "test-value" } });

        const el = document.querySelector(".nihon-kojin-bango-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nihon-kojin-bango-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Nihon Kojin Bango", value: "test-value" } });

        const el = document.querySelector(".nihon-kojin-bango-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Nihon Kojin Bango" } });

        const el = document.querySelector(".nihon-kojin-bango-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Nihon Kojin Bango"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
