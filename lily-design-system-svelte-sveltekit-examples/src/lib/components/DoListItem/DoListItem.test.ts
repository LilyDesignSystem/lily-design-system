import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DoListItem from "./DoListItem.svelte";

describe("DoListItem", () => {
    test("renders the component", () => {
        render(DoListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
