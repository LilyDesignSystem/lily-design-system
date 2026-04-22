import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ScrollArea from "./ScrollArea.svelte";

describe("ScrollArea", () => {
    test("renders the component", () => {
        render(ScrollArea, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
