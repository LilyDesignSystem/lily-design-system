import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import FloatingPanel from "./FloatingPanel.svelte";

describe("FloatingPanel", () => {
    test("renders the component", () => {
        render(FloatingPanel, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
