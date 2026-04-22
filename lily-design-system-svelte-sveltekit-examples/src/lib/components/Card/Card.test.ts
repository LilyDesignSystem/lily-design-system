import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Card from "./Card.svelte";

describe("Card", () => {
    test("renders the component", () => {
        render(Card, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
