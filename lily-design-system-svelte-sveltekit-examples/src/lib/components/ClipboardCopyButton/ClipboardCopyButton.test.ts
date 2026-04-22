import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ClipboardCopyButton from "./ClipboardCopyButton.svelte";

describe("ClipboardCopyButton", () => {
    test("renders the component", () => {
        render(ClipboardCopyButton, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
