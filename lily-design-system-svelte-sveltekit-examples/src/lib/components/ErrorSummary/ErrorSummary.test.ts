import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ErrorSummary from "./ErrorSummary.svelte";

describe("ErrorSummary", () => {
    test("renders the component", () => {
        render(ErrorSummary, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
