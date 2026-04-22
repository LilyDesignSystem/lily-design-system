import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Sheet from "./Sheet.svelte";

describe("Sheet", () => {
    test("renders the component", () => {
        render(Sheet, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
