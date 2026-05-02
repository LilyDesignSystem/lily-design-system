import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Diff";

describe("Diff", () => {
    test("renders a div with class diff", () => {
        const { container } = render(
            <Subject label="Code comparison"><div>A</div><div>B</div></Subject>
        );
        const root = container.querySelector(".diff");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=group", () => {
        render(<Subject label="Code comparison"><div>A</div><div>B</div></Subject>);
        const group = screen.getByRole("group", { name: "Code comparison" });
        expect(group).toBeTruthy();
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(
            <Subject label="Hello"><div>A</div><div>B</div></Subject>
        );
        const root = container.querySelector(".diff");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("renders both children", () => {
        const { container } = render(
            <Subject label="x"><div>before</div><div>after</div></Subject>
        );
        expect(container.textContent).toContain("before");
        expect(container.textContent).toContain("after");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject label="x" data-testid="diff"><div>A</div><div>B</div></Subject>
        );
        expect(container.querySelector("[data-testid='diff']")).toBeTruthy();
    });
});
