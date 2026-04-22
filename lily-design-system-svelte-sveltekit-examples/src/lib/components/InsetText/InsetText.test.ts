import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import InsetText from "./InsetText.svelte";

describe("InsetText", () => {
    test("renders the component", () => {
        render(InsetText, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
