import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Subject from "./FileDialog";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("FileDialog", () => {
    test("not visible when closed", () => {
        render(
            <Subject
                label="Open"
                open={false}
            >
                files
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });
    test("visible when open", () => {
        render(
            <Subject
                label="Open"
                open
            >
                files
            </Subject>,
        );
        expect(screen.getByRole("dialog")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(
            <Subject
                label="Open file"
                open
            >
                files
            </Subject>,
        );
        expect(screen.getByLabelText("Open file")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                open
                data-testid="fd"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("fd")).toBeTruthy();
    });

    test("Escape asks to close the dialog", () => {
        const onChange = vi.fn();
        render(
            <Subject
                label="Open"
                open
                onChange={onChange}
            >
                files
            </Subject>,
        );
        fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
        expect(onChange).toHaveBeenCalledWith(false);
    });
});
