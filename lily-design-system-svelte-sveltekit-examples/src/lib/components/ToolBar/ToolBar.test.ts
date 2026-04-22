import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ToolBar from "./ToolBar.svelte";

describe("ToolBar", () => {
    test("renders the component", () => {
        render(ToolBar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
