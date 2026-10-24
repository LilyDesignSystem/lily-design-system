import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ConvertDiv";

describe("ConvertDiv", () => {
    test("renders a div with the base class", () => {
        const { container } = render(<Subject label="Currency converter">content</Subject>);
        expect(container.querySelector("div.convert-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        const { container } = render(<Subject label="Currency converter" className="mine">content</Subject>);
        expect(container.querySelector(".convert-div")?.getAttribute("class")).toBe("convert-div mine");
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="Currency converter">content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject label="Currency converter" data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });

    test("is a named group", () => {
        const { getByRole } = render(<Subject label="Currency converter">content</Subject>);
        expect(getByRole("group", { name: "Currency converter" })).toBeTruthy();
    });
});
