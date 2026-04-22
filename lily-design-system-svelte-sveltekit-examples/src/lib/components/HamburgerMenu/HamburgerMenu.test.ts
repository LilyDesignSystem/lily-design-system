import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import HamburgerMenu from "./HamburgerMenu.svelte";

describe("HamburgerMenu", () => {
    test("renders the component", () => {
        render(HamburgerMenu, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
