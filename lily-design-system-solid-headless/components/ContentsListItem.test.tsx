import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ContentsListItem";

describe("ContentsListItem", () => {
    test("renders a list item element", () => {
        render(() => <Subject>Introduction</Subject>);

        const item = screen.getByRole("listitem");
        expect(item.tagName).toBe("LI");
    });

    test("renders children content", () => {
        render(() => <Subject>Chapter 1</Subject>);

        const item = screen.getByRole("listitem");
        expect(item.textContent).toContain("Chapter 1");
    });

    test("passes through additional HTML attributes", () => {
        render(() => <Subject data-testid="toc-item">Section</Subject>);

        const item = screen.getByTestId("toc-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(() => <Subject id="item-1">Section</Subject>);

        const item = screen.getByRole("listitem");
        expect(item.getAttribute("id")).toBe("item-1");
    });

    test("passes through aria-current attribute", () => {
        render(() => <Subject aria-current="page">Current page</Subject>);

        const item = screen.getByRole("listitem");
        expect(item.getAttribute("aria-current")).toBe("page");
    });
});
