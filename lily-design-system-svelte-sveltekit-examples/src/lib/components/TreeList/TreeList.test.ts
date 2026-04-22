import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TreeList from "./TreeList.svelte";

describe("TreeList", () => {
    test("renders the component", () => {
        render(TreeList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
