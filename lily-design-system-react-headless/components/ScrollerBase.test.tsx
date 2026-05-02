import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollerBase";

describe("ScrollerBase", () => {
    test("renders a div with class scroller-base", () => {
        const { container } = render(
            <Subject>
                <div>step 1</div>
                <div>step 2</div>
            </Subject>
        );
        const root = container.querySelector(".scroller-base");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(
            <Subject label="My story"><div>1</div></Subject>
        );
        const root = container.querySelector(".scroller-base");
        expect(root?.getAttribute("aria-label")).toBe("My story");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(<Subject><div>1</div></Subject>);
        const root = container.querySelector(".scroller-base");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("renders all step children", () => {
        const { container } = render(
            <Subject>
                <div>one</div>
                <div>two</div>
                <div>three</div>
            </Subject>
        );
        const root = container.querySelector(".scroller-base") as HTMLElement;
        expect(root.children.length).toBe(3);
        expect(root.children[0].textContent).toBe("one");
        expect(root.children[2].textContent).toBe("three");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject data-testid="sb"><div>1</div></Subject>
        );
        expect(container.querySelector("[data-testid='sb']")).toBeTruthy();
    });
});
