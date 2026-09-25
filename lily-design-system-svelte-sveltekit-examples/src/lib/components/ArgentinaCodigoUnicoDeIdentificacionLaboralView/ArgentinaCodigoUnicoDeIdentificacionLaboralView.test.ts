import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ArgentinaCodigoUnicoDeIdentificacionLaboralView from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.svelte";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
    test("renders with content", () => {
        render(ArgentinaCodigoUnicoDeIdentificacionLaboralView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-view");
    });
});
