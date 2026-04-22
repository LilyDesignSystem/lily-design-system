import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ProgressSpinner from "./ProgressSpinner.svelte";

describe("ProgressSpinner", () => {
    test("renders the component", () => {
        render(ProgressSpinner, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
