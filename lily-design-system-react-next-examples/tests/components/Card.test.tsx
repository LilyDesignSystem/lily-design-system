import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Card from "@lily/Card";

describe("Card", () => {
    test("renders card content", () => {
        render(<Card>Card body content</Card>);
        expect(screen.getByText("Card body content")).toBeTruthy();
    });

    test("renders heading when provided", () => {
        render(<Card heading="Card Title">Content</Card>);
        expect(screen.getByText("Card Title")).toBeTruthy();
    });
});
