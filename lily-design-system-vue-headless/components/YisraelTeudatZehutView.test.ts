import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./YisraelTeudatZehutView.vue";

describe("YisraelTeudatZehutView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Yisrael Teudat Zehut", value: "test-value" } });

        const el = document.querySelector(".yisrael-teudat-zehut-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("yisrael-teudat-zehut-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Yisrael Teudat Zehut", value: "test-value" } });

        const el = document.querySelector(".yisrael-teudat-zehut-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Yisrael Teudat Zehut" } });

        const el = document.querySelector(".yisrael-teudat-zehut-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Yisrael Teudat Zehut"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
