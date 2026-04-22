import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ToggleGroup from "./ToggleGroup.svelte";

describe("ToggleGroup", () => {
    test("renders the component", () => {
        render(ToggleGroup, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
