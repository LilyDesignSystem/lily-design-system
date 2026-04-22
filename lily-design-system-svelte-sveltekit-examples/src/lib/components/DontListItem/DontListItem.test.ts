import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DontListItem from "./DontListItem.svelte";

describe("DontListItem", () => {
    test("renders the component", () => {
        render(DontListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
