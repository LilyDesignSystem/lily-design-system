import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SearchInput from "./SearchInput.svelte";

describe("SearchInput", () => {
    test("renders the component", () => {
        render(SearchInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
