import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Label from "./Label.svelte";

describe("Label", () => {
    test("renders the component", () => {
        render(Label, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
