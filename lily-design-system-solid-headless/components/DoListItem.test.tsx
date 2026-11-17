import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./DoListItem";

describe("DoListItem", () => {
    test("renders a list item", () => {
        render(() => <Subject>Use semantic HTML</Subject>);
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(() => <Subject>Provide alt text</Subject>);
        expect(screen.getByText("Provide alt text")).toBeTruthy();
    });

    test("sets data-recommendation to do", () => {
        render(() => <Subject>Use labels</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-recommendation")).toBe("do");
    });

    test("passes through data-testid attribute", () => {
        render(() => <Subject data-testid="do-item">Tip</Subject>);
        expect(screen.getByTestId("do-item")).toBeTruthy();
        expect(screen.getByTestId("do-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(() => <Subject id="do-1">Tip</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("do-1");
    });

    test("passes through aria-label attribute", () => {
        render(() => <Subject aria-label="recommended">Tip</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("aria-label")).toBe("recommended");
    });
});
