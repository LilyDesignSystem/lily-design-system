import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Sonner";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("Sonner", () => {
    test("renders a region", () => {
        render(<Subject label="Notifications">toast</Subject>);
        expect(screen.getByRole("region")).toBeTruthy();
    });
    test("has aria-live", () => {
        render(<Subject label="Notifications">toast</Subject>);
        expect(screen.getByRole("region").getAttribute("aria-live")).toBe("polite");
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="sn"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sn")).toBeTruthy();
    });
});
