import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";
import Subject from "./Sparkline";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("Sparkline", () => {
    test("renders img role", () => {
        render(() => <Subject label="Trend">chart</Subject>);
        expect(screen.getByRole("img")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(() => <Subject label="Price trend">chart</Subject>);
        expect(screen.getByLabelText("Price trend")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(() => (
            <Subject
                label="S"
                data-testid="sl"
            >
                x
            </Subject>
        ));
        expect(screen.getByTestId("sl")).toBeTruthy();
    });

    test("below minimumPoints it shows the consumer's words as text, not the graphic", () => {
        const { container } = render(() => (
            <Subject
                label="Weight trend"
                pointCount={2}
                minimumPoints={3}
                insufficientLabel="Not enough readings for a trend"
            >
                <svg />
            </Subject>
        ));
        const root = container.querySelector(".sparkline") as HTMLElement;
        expect(root.hasAttribute("data-insufficient")).toBe(true);
        expect(root.getAttribute("role")).toBeNull();
        expect(root.querySelector("svg")).toBeNull();
        expect(root.querySelector(".sparkline-insufficient")?.textContent).toBe(
            "Not enough readings for a trend",
        );
    });
});
