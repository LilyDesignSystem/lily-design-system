import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MenuBar from "./MenuBar.svelte";

describe("MenuBar", () => {
    test("renders the component", () => {
        render(MenuBar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
