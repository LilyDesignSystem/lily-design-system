import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ToggleButton from "./ToggleButton.svelte";

describe("ToggleButton", () => {
    test("renders the component", () => {
        render(ToggleButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
