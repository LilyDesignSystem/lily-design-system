import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryListItem";

describe("SummaryListItem", () => {
    test("renders a dt element with the term", () => {
        render(<Subject term="Product">Widget</Subject>);
        const dt = screen.getByText("Product");
        expect(dt.tagName).toBe("DT");
    });

    test("renders a dd element with children content", () => {
        render(<Subject term="Product">Widget</Subject>);
        const dd = screen.getByText("Widget");
        expect(dd.tagName).toBe("DD");
    });

    test("renders dt and dd within a div wrapper", () => {
        render(<Subject term="Qty">3</Subject>);
        const dt = screen.getByText("Qty");
        const dd = screen.getByText("3");
        expect(dt.parentElement?.tagName).toBe("DIV");
        expect(dd.parentElement?.tagName).toBe("DIV");
        expect(dt.parentElement).toBe(dd.parentElement);
    });

    test("dt appears before dd in DOM order", () => {
        render(<Subject term="Total">$29.97</Subject>);
        const dt = screen.getByText("Total");
        const dd = screen.getByText("$29.97");
        const parent = dt.parentElement!;
        const children = Array.from(parent.children);
        expect(children.indexOf(dt)).toBeLessThan(children.indexOf(dd));
    });

    test("passes through attributes to wrapper div", () => {
        render(
            <Subject
                term="Key"
                data-testid="sli"
            >
                Value
            </Subject>,
        );
        expect(screen.getByTestId("sli")).toBeTruthy();
        expect(screen.getByTestId("sli").tagName).toBe("DIV");
    });

    test("passes through id attribute", () => {
        render(
            <Subject
                term="Key"
                id="row-1"
            >
                Value
            </Subject>,
        );
        const dt = screen.getByText("Key");
        expect(dt.parentElement?.getAttribute("id")).toBe("row-1");
    });
});
