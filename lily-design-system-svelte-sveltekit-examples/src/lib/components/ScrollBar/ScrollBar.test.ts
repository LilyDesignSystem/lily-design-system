import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ScrollBar from "./ScrollBar.svelte";

describe("ScrollBar", () => {
    test("renders the component", () => {
        render(ScrollBar, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
