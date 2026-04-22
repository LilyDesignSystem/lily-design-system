import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PaginationListItem from "./PaginationListItem.svelte";

describe("PaginationListItem", () => {
    test("renders the component", () => {
        render(PaginationListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
