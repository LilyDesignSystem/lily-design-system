import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Details from "./Details.svelte";

describe("Details", () => {
    test("renders the component", () => {
        render(Details, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
