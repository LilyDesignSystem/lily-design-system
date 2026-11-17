import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./MenuItem";

describe("MenuItem", () => {
    test("renders a div with menuitem role", () => {
        render(() => <Subject>New File</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.tagName).toBe("DIV");
    });

    test("displays children content", () => {
        render(() => <Subject>Open File</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.textContent).toContain("Open File");
    });

    test("has tabindex -1 for roving focus", () => {
        render(() => <Subject>Save</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("tabindex")).toBe("-1");
    });

    test("passes through additional HTML attributes", () => {
        render(() => <Subject data-testid="menu-item">Exit</Subject>);

        const item = screen.getByTestId("menu-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(() => <Subject id="menu-save">Save</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("id")).toBe("menu-save");
    });

    test("supports aria-disabled attribute", () => {
        render(() => <Subject aria-disabled="true">Undo</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-disabled")).toBe("true");
    });

    test("supports aria-haspopup for submenu triggers", () => {
        render(() => <Subject aria-haspopup="true">More Options</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-haspopup")).toBe("true");
    });
});
