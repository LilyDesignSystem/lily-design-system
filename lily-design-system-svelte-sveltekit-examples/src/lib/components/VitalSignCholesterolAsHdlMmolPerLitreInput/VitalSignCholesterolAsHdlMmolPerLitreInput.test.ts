import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignCholesterolAsHdlMmolPerLitreInput from "./VitalSignCholesterolAsHdlMmolPerLitreInput.svelte";

describe("VitalSignCholesterolAsHdlMmolPerLitreInput", () => {
    test("renders with content", () => {
        render(VitalSignCholesterolAsHdlMmolPerLitreInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-cholesterol-as-hdl-mmol-per-litre-input");
    });
});
