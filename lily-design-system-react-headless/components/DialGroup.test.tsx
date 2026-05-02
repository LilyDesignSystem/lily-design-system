import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DialGroup";

describe("DialGroup", () => {
    test("renders a div with class dial-group", () => {
        const { container } = render(<Subject label="Audio">dials</Subject>);
        const root = container.querySelector(".dial-group");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=group with aria-label", () => {
        render(<Subject label="Audio settings">dials</Subject>);
        const group = screen.getByRole("group", { name: "Audio settings" });
        expect(group).toBeTruthy();
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="x">dial-1 dial-2</Subject>);
        expect(container.textContent).toBe("dial-1 dial-2");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject label="x" data-testid="dg">x</Subject>
        );
        expect(container.querySelector("[data-testid='dg']")).toBeTruthy();
    });
});
