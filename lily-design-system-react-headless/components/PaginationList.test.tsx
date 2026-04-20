import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationList";

const pageItems = (
    <>
        <li><a href="/page/1">1</a></li>
        <li><a href="/page/2">2</a></li>
        <li><a href="/page/3">3</a></li>
    </>
);

describe("PaginationList", () => {
    test("renders an ordered list", () => {
        render(<Subject>{pageItems}</Subject>);
        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has aria-label when provided", () => {
        render(<Subject label="Pages">{pageItems}</Subject>);
        expect(screen.getByLabelText("Pages")).toBeTruthy();
    });

    test("renders children links", () => {
        render(<Subject>{pageItems}</Subject>);
        expect(screen.getByText("1")).toBeTruthy();
        expect(screen.getByText("2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="pg">{pageItems}</Subject>);
        expect(screen.getByTestId("pg")).toBeTruthy();
    });
});
