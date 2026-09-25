import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BrasilCartaoNacionalDeSaudeView from "./BrasilCartaoNacionalDeSaudeView.svelte";

describe("BrasilCartaoNacionalDeSaudeView", () => {
    test("renders with content", () => {
        render(BrasilCartaoNacionalDeSaudeView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-view");
    });
});
