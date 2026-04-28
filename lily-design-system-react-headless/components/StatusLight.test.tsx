import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./StatusLight";

describe("StatusLight", () => {
    test("renders with role status", () => {
        render(<Subject label="Active" />);

        const root: HTMLElement = screen.getByRole("status");
        expect(root).toBeTruthy();
    });

    test("applies the status-light root class", () => {
        render(<Subject label="Active" />);

        const root: HTMLElement = screen.getByRole("status");
        expect(root.className.includes("status-light")).toBe(true);
    });

    test("defaults variant to neutral", () => {
        render(<Subject label="Idle" />);

        const root: HTMLElement = screen.getByRole("status");
        expect(root.getAttribute("data-variant")).toBe("neutral");
    });

    test("exposes variant via data-variant", () => {
        render(<Subject label="Active" variant="positive" />);

        const root: HTMLElement = screen.getByRole("status");
        expect(root.getAttribute("data-variant")).toBe("positive");
    });

    test("renders the label text", () => {
        render(<Subject label="Offline" variant="negative" />);

        expect(screen.getByText("Offline")).toBeTruthy();
    });

    test("renders the decorative dot as aria-hidden", () => {
        const { container } = render(<Subject label="Active" />);

        const dot: HTMLElement | null = container.querySelector(".status-light-dot");
        expect(dot).toBeTruthy();
        expect(dot?.getAttribute("aria-hidden")).toBe("true");
    });

    test("supports each variant", () => {
        const variants: ReadonlyArray<string> = [
            "neutral",
            "informative",
            "positive",
            "notice",
            "negative",
            "active",
            "inactive",
        ];
        for (const v of variants) {
            const { container, unmount } = render(
                <Subject label="X" variant={v as never} />
            );
            const root: HTMLElement | null = container.querySelector(".status-light");
            expect(root?.getAttribute("data-variant")).toBe(v);
            unmount();
        }
    });
});
