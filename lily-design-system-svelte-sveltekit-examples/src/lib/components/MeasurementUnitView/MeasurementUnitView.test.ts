import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MeasurementUnitView from "./MeasurementUnitView.svelte";

describe("MeasurementUnitView", () => {
    test("renders the component", () => {
        render(MeasurementUnitView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
