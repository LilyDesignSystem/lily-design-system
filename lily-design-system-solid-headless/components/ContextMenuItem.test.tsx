import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ContextMenuItem";

describe("ContextMenuItem", () => {
    test("renders a div with menuitem role", () => {
        render(() => <Subject>Cut</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.tagName).toBe("DIV");
    });

    test("displays children content", () => {
        render(() => <Subject>Copy</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.textContent).toContain("Copy");
    });

    test("has tabindex -1 for roving focus", () => {
        render(() => <Subject>Paste</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("tabindex")).toBe("-1");
    });

    test("passes through additional HTML attributes", () => {
        render(() => <Subject data-testid="ctx-item">Delete</Subject>);

        const item = screen.getByTestId("ctx-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(() => <Subject id="ctx-cut">Cut</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("id")).toBe("ctx-cut");
    });

    test("supports aria-disabled attribute", () => {
        render(() => <Subject aria-disabled="true">Delete</Subject>);

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-disabled")).toBe("true");
    });
});
