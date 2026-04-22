import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContentsListItem from "./ContentsListItem.svelte";

describe("ContentsListItem", () => {
    test("renders the component", () => {
        render(ContentsListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
