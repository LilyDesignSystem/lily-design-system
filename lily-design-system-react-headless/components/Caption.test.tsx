import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Caption";

describe("Caption", () => {
    test("renders as a figcaption element", () => {
        render(<Subject data-testid="caption">A photo caption</Subject>);

        const caption = screen.getByTestId("caption");
        expect(caption.tagName.toLowerCase()).toBe("figcaption");
    });

    test("renders children content", () => {
        render(<Subject data-testid="caption">Figure 1: Revenue growth</Subject>);

        expect(screen.getByTestId("caption").textContent).toContain("Figure 1: Revenue growth");
    });

    test("applies id for aria-describedby references", () => {
        render(
            <Subject
                id="chart-desc"
                data-testid="caption"
            >
                Chart description
            </Subject>,
        );

        expect(screen.getByTestId("caption").getAttribute("id")).toBe("chart-desc");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                data-testid="caption"
                data-media="image"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("caption").getAttribute("data-media")).toBe("image");
    });
});
