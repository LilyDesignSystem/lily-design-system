import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MenuItem from "./MenuItem.svelte";

describe("MenuItem", () => {
    test("renders the component", () => {
        render(MenuItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
