import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignCholesterolAsHdlMmolPerLitreView from "./VitalSignCholesterolAsHdlMmolPerLitreView.svelte";

describe("VitalSignCholesterolAsHdlMmolPerLitreView", () => {
    test("renders with content", () => {
        render(VitalSignCholesterolAsHdlMmolPerLitreView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-cholesterol-as-hdl-mmol-per-litre-view");
    });
});
