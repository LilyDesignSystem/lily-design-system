import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./GoToNextSection";

describe("GoToNextSection", () => {
    test("renders root with class go-to-next-section", () => {
        const { container } = render(<Subject href="#section" label="Go" />);
        expect(container.querySelector(".go-to-next-section")).toBeTruthy();
    });
});
