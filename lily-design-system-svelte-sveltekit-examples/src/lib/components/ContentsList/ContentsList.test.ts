import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContentsList from "./ContentsList.svelte";

describe("ContentsList", () => {
    test("renders the component", () => {
        render(ContentsList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
