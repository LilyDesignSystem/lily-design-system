import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import TimeoutDialog from "./TimeoutDialog.svelte";

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`,
    }));
}

describe("TimeoutDialog", () => {
    it("renders with class", () => {
        const { container } = render(TimeoutDialog, {
            props: { label: "Test", children: textSnippet("content") },
        });
        const el = container.querySelector(".timeout-dialog");
        expect(el).toBeTruthy();
    });

    it("opens when open becomes true and closes when it becomes false", async () => {
        const { container, rerender } = render(TimeoutDialog, {
            props: { label: "Session about to expire", open: false, children: textSnippet("Soon") },
        });
        const dialog = container.querySelector("dialog") as HTMLDialogElement;
        expect(dialog.open).toBe(false);
        await rerender({ open: true });
        expect(dialog.open).toBe(true);
        await rerender({ open: false });
        expect(dialog.open).toBe(false);
    });
});
