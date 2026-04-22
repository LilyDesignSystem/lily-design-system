import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import VitalSignWeightAsKgView from "./VitalSignWeightAsKgView.svelte";

describe("VitalSignWeightAsKgView", () => {
    test("renders with content", () => {
        render(VitalSignWeightAsKgView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("vital-sign-weight-as-kg-view");
    });
});
