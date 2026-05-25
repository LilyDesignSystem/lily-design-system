import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TextInputWithSearch";

describe("TextInputWithSearch", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".text-input-with-search");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".text-input-with-search");
        expect(el?.className).toContain("text-input-with-search");
        expect(el?.className).toContain("extra");
    });
});
