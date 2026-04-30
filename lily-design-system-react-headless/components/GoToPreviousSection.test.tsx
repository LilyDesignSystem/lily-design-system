import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./GoToPreviousSection";

describe("GoToPreviousSection", () => {
    test("renders root with class go-to-previous-section", () => {
        const { container } = render(<Subject href="#section" label="Go" />);
        expect(container.querySelector(".go-to-previous-section")).toBeTruthy();
    });
});
