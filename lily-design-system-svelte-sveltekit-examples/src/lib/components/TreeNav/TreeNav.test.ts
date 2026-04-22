import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeNav from "./TreeNav.svelte";

describe("TreeNav", () => {
    test("renders the component", () => {
        render(TreeNav, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
