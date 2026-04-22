import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ToolBarButton from "./ToolBarButton.svelte";

describe("ToolBarButton", () => {
    test("renders the component", () => {
        render(ToolBarButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
