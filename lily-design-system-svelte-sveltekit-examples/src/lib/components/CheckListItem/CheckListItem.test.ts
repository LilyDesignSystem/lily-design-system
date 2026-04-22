import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CheckListItem from "./CheckListItem.svelte";

describe("CheckListItem", () => {
    test("renders the component", () => {
        render(CheckListItem, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
