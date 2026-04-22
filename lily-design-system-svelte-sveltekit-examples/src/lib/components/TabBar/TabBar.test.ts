import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TabBar from "./TabBar.svelte";

describe("TabBar", () => {
    test("renders the component", () => {
        render(TabBar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
