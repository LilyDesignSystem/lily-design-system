import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ArgentinaCodigoUnicoDeIdentificacionLaboralInput from "./ArgentinaCodigoUnicoDeIdentificacionLaboralInput.svelte";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralInput", () => {
    test("renders with content", () => {
        render(ArgentinaCodigoUnicoDeIdentificacionLaboralInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("argentina-codigo-unico-de-identificacion-laboral-input");
    });
});
