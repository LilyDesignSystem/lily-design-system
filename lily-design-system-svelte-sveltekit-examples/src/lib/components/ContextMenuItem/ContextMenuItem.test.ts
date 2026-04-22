import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContextMenuItem from "./ContextMenuItem.svelte";

describe("ContextMenuItem", () => {
    test("renders the component", () => {
        render(ContextMenuItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
