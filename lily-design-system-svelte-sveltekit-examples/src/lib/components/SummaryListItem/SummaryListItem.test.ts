import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SummaryListItem from "./SummaryListItem.svelte";

describe("SummaryListItem", () => {
    test("renders the component", () => {
        render(SummaryListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
