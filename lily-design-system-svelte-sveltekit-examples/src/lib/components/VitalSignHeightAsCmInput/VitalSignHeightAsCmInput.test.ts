import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignHeightAsCmInput from "./VitalSignHeightAsCmInput.svelte";

describe("VitalSignHeightAsCmInput", () => {
    test("renders with content", () => {
        render(VitalSignHeightAsCmInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-height-as-cm-input");
    });
});
