import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationListItem";

describe("PaginationListItem", () => {
    test("renders a list item", () => {
        render(() => <Subject data-testid="pli">1</Subject>);
        expect(screen.getByTestId("pli").tagName).toBe("LI");
    });

    test("renders children", () => {
        render(() => <Subject>Page 2</Subject>);
        expect(screen.getByText("Page 2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="item">X</Subject>);
        expect(screen.getByTestId("item")).toBeTruthy();
    });
});
