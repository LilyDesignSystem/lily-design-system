import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Menu from "./Menu.svelte";

describe("Menu", () => {
    test("renders the component", () => {
        render(Menu, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
