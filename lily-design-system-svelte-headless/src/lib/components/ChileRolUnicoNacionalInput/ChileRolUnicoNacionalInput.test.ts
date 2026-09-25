import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChileRolUnicoNacionalInput from "./ChileRolUnicoNacionalInput.svelte";

describe("ChileRolUnicoNacionalInput", () => {
    test("renders with content", () => {
        render(ChileRolUnicoNacionalInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chile-rol-unico-nacional-input");
    });
});
