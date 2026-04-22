import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignCholesterolAsLdlMmolPerLitreInput from "./VitalSignCholesterolAsLdlMmolPerLitreInput.svelte";

describe("VitalSignCholesterolAsLdlMmolPerLitreInput", () => {
    test("renders with content", () => {
        render(VitalSignCholesterolAsLdlMmolPerLitreInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-cholesterol-as-ldl-mmol-per-litre-input");
    });
});
