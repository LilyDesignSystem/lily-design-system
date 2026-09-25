import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BrasilCartaoNacionalDeSaudeView.vue";

describe("BrasilCartaoNacionalDeSaudeView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude", value: "test-value" } });

        const el = screen.getByLabelText("Brasil Cartao Nacional De Saude");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude", value: "test-value" } });

        const el = screen.getByLabelText("Brasil Cartao Nacional De Saude");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Brasil Cartao Nacional De Saude" } });

        const el = screen.getByLabelText("Brasil Cartao Nacional De Saude");
        expect(el.getAttribute("aria-label")).toBe("Brasil Cartao Nacional De Saude");
    });
});
