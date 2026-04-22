import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Slider from "./Slider.svelte";

describe("Slider", () => {
    test("renders the component", () => {
        render(Slider, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
