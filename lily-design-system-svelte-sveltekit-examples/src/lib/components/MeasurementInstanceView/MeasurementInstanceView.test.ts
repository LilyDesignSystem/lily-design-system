import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MeasurementInstanceView from "./MeasurementInstanceView.svelte";

describe("MeasurementInstanceView", () => {
    test("renders the component", () => {
        render(MeasurementInstanceView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
