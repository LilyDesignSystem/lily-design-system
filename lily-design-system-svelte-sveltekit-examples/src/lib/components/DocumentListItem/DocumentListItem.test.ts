import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DocumentListItem from "./DocumentListItem.svelte";

describe("DocumentListItem", () => {
    test("renders the component", () => {
        render(DocumentListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
