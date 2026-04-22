import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MeasurementSystemView from "./MeasurementSystemView.svelte";

describe("MeasurementSystemView", () => {
    test("renders the component", () => {
        render(MeasurementSystemView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
