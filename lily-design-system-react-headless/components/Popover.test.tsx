import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Popover";
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}
describe("Popover", () => {
    test("hidden when closed", () => {
        render(
            <Subject
                label="Info"
                open={false}
            >
                C
            </Subject>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
    });
    test("visible when open", () => {
        render(
            <Subject
                label="Info"
                open
            >
                C
            </Subject>,
        );
        expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy();
    });
    test("renders children", () => {
        render(
            <Subject
                label="I"
                open
            >
                Content
            </Subject>,
        );
        expect(screen.getByRole("dialog").textContent).toContain("Content");
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="I"
                open
                data-testid="po"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("po")).toBeTruthy();
    });
});
