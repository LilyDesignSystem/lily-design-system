import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Byline";

describe("Byline", () => {
    test("renders a div with class byline", () => {
        const { container } = render(<Subject>Jane Smith</Subject>);
        const root = container.querySelector(".byline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders the authors children", () => {
        const { container } = render(<Subject>Jane Smith</Subject>);
        expect(container.querySelector(".byline-authors")?.textContent).toBe("Jane Smith");
    });

    test("renders the published slot when provided", () => {
        const { container } = render(
            <Subject published={<time dateTime="2026-04-15">April 15, 2026</time>}>
                Jane Smith
            </Subject>
        );
        const pub = container.querySelector(".byline-published time");
        expect(pub?.getAttribute("datetime")).toBe("2026-04-15");
        expect(pub?.textContent).toBe("April 15, 2026");
    });

    test("omits published slot when not provided", () => {
        const { container } = render(<Subject>Jane Smith</Subject>);
        expect(container.querySelector(".byline-published")).toBeNull();
    });

    test("renders the updated slot when provided", () => {
        const { container } = render(
            <Subject
                published={<time dateTime="2026-04-15">April 15</time>}
                updated={<time dateTime="2026-04-16">April 16</time>}
            >
                Jane Smith
            </Subject>
        );
        const upd = container.querySelector(".byline-updated time");
        expect(upd?.getAttribute("datetime")).toBe("2026-04-16");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject data-testid="byline">Jane Smith</Subject>
        );
        expect(container.querySelector("[data-testid='byline']")).toBeTruthy();
    });
});
