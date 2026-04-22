import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SkipLink from "./SkipLink.svelte";

describe("SkipLink", () => {
    test("renders the component", () => {
        render(SkipLink, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
