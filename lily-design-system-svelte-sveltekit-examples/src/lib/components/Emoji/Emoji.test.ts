import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Emoji from "./Emoji.svelte";

describe("Emoji", () => {
    test("renders the component", () => {
        render(Emoji, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
