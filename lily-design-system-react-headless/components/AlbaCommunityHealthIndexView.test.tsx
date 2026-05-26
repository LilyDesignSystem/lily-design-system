import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AlbaCommunityHealthIndexView";

describe("AlbaCommunityHealthIndexView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Community Health Index" value="test-value" />);

        const el = screen.getByLabelText("Community Health Index");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("alba-community-health-index-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Community Health Index" value="test-value" />);

        const el = screen.getByLabelText("Community Health Index");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Community Health Index" />);

        const el = screen.getByLabelText("Community Health Index");
        expect(el.getAttribute("aria-label")).toBe("Community Health Index");
    });
});
