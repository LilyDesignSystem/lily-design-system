import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TimeoutDialog from "./TimeoutDialog.svelte";

describe("TimeoutDialog", () => {
    test("renders the component", () => {
        render(TimeoutDialog, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
