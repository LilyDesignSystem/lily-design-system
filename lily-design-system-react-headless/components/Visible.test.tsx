import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Visible";

describe("Visible", () => {
    test("renders a div with class visible", () => {
        const { container } = render(
            <Subject>{(visible) => <span>{visible ? "yes" : "no"}</span>}</Subject>
        );
        const root = container.querySelector(".visible");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("calls children with initial visibility false", () => {
        const { container } = render(
            <Subject>{(visible) => <span>{visible ? "yes" : "no"}</span>}</Subject>
        );
        expect(container.textContent).toBe("no");
    });

    test("exposes data-visible attribute", () => {
        const { container } = render(
            <Subject>{() => <span>x</span>}</Subject>
        );
        expect(container.querySelector(".visible")?.getAttribute("data-visible")).toBe("false");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject data-testid="v">{() => <span>x</span>}</Subject>
        );
        expect(container.querySelector("[data-testid='v']")).toBeTruthy();
    });
});
