import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SuccessPanel from "./SuccessPanel";

describe("SuccessPanel", () => {
    it("renders with class", () => {
        const { container } = render(<SuccessPanel label="Test">content</SuccessPanel>);
        const el = container.querySelector(".success-panel");
        expect(el).toBeTruthy();
    });

    it("has role=status with its label", () => {
        const { container } = render(<SuccessPanel label="Story">content</SuccessPanel>);
        const root = container.querySelector(".success-panel");
        expect(root?.getAttribute("role")).toBe("status");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });
});
