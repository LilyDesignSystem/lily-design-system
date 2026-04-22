import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DropdownMenu from "./DropdownMenu.svelte";

describe("DropdownMenu", () => {
    test("renders the component", () => {
        render(DropdownMenu, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
