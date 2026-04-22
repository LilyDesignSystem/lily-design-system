import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Command from "./Command.svelte";

describe("Command", () => {
    test("renders the component", () => {
        render(Command, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
