import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignHeightAsCmView from "./VitalSignHeightAsCmView.svelte";

describe("VitalSignHeightAsCmView", () => {
    test("renders with content", () => {
        render(VitalSignHeightAsCmView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-height-as-cm-view");
    });
});
