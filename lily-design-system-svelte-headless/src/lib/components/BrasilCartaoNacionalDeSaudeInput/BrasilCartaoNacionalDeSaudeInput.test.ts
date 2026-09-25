import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BrasilCartaoNacionalDeSaudeInput from "./BrasilCartaoNacionalDeSaudeInput.svelte";

describe("BrasilCartaoNacionalDeSaudeInput", () => {
    test("renders with content", () => {
        render(BrasilCartaoNacionalDeSaudeInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("brasil-cartao-nacional-de-saude-input");
    });
});
