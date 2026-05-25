import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BannerBox";

describe("BannerBox", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo" />);
        const el = container.querySelector(".banner-box");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(<Subject label="Demo" className="extra" />);
        const el = container.querySelector(".banner-box");
        expect(el?.className).toContain("banner-box");
        expect(el?.className).toContain("extra");
    });
});
