import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./DontListItem";

describe("DontListItem", () => {
    test("renders a list item", () => {
        render(() => <Subject>Use color alone</Subject>);
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(() => <Subject>Remove focus outlines</Subject>);
        expect(screen.getByText("Remove focus outlines")).toBeTruthy();
    });

    test("sets data-recommendation to dont", () => {
        render(() => <Subject>Skip labels</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-recommendation")).toBe("dont");
    });

    test("passes through data-testid attribute", () => {
        render(() => <Subject data-testid="dont-item">Bad practice</Subject>);
        expect(screen.getByTestId("dont-item")).toBeTruthy();
        expect(screen.getByTestId("dont-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(() => <Subject id="dont-1">Avoid</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("dont-1");
    });

    test("passes through aria-label attribute", () => {
        render(() => <Subject aria-label="discouraged">Avoid</Subject>);
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("aria-label")).toBe("discouraged");
    });
});
