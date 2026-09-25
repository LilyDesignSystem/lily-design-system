import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ChileRolUnicoNacionalView from "./ChileRolUnicoNacionalView.svelte";

describe("ChileRolUnicoNacionalView", () => {
    test("renders with content", () => {
        render(ChileRolUnicoNacionalView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chile-rol-unico-nacional-view");
    });
});
