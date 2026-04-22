import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignCholesterolAsLdlMmolPerLitreView from "./VitalSignCholesterolAsLdlMmolPerLitreView.svelte";

describe("VitalSignCholesterolAsLdlMmolPerLitreView", () => {
    test("renders with content", () => {
        render(VitalSignCholesterolAsLdlMmolPerLitreView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-cholesterol-as-ldl-mmol-per-litre-view");
    });
});
