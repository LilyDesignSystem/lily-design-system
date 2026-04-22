import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContextMenu from "./ContextMenu.svelte";

describe("ContextMenu", () => {
    test("renders the component", () => {
        render(ContextMenu, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
