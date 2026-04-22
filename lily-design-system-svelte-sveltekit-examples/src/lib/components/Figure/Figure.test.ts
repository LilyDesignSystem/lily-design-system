import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Figure from "./Figure.svelte";

describe("Figure", () => {
    test("renders the component", () => {
        render(Figure, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
