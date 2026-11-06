import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BrasilCartaoNacionalDeSaudeView.vue";

describe("BrasilCartaoNacionalDeSaudeView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Brasil Cartao Nacional De Saude", value: "test-value" },
        });

        const el = document.querySelector(".brasil-cartao-nacional-de-saude-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Brasil Cartao Nacional De Saude", value: "test-value" },
        });

        const el = document.querySelector(".brasil-cartao-nacional-de-saude-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const el = document.querySelector(".brasil-cartao-nacional-de-saude-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Brasil Cartao Nacional De Saude"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});
