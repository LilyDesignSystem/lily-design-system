import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Dial from "./Dial.svelte";

describe("Dial", () => {
    test("renders the component", () => {
        render(Dial, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
