import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Drawer from "./Drawer.svelte";

describe("Drawer", () => {
    test("renders the component", () => {
        render(Drawer, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
