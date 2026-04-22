import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MenuBarButton from "./MenuBarButton.svelte";

describe("MenuBarButton", () => {
    test("renders the component", () => {
        render(MenuBarButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
