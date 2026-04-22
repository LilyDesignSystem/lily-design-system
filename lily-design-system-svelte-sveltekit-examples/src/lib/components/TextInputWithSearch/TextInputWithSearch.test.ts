import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TextInputWithSearch from "./TextInputWithSearch.svelte";

describe("TextInputWithSearch", () => {
    test("renders the component", () => {
        render(TextInputWithSearch, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
