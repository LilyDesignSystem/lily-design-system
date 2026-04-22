import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import NavigationMenu from "./NavigationMenu.svelte";

describe("NavigationMenu", () => {
    test("renders the component", () => {
        render(NavigationMenu, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
