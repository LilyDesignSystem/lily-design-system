import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SplitView";

describe("SplitView", () => {
    test("applies the split-view root class", () => {
        const { container } = render(
            <Subject label="Editor" primary={<div>P</div>} secondary={<div>S</div>} />
        );

        const root: HTMLElement | null = container.querySelector(".split-view");
        expect(root).toBeTruthy();
    });

    test("sets aria-label from the label prop", () => {
        const { container } = render(
            <Subject label="Editor" primary={<div>P</div>} secondary={<div>S</div>} />
        );

        const root: HTMLElement | null = container.querySelector(".split-view");
        expect(root?.getAttribute("aria-label")).toBe("Editor");
    });

    test("defaults orientation to horizontal", () => {
        const { container } = render(
            <Subject label="Editor" primary={<div>P</div>} secondary={<div>S</div>} />
        );

        const root: HTMLElement | null = container.querySelector(".split-view");
        expect(root?.getAttribute("data-orientation")).toBe("horizontal");
    });

    test("supports vertical orientation", () => {
        const { container } = render(
            <Subject
            label="Editor"
            orientation="vertical"
            primary={<div>P</div>}
            secondary={<div>S</div>}
            />
        );

        const root: HTMLElement | null = container.querySelector(".split-view");
        expect(root?.getAttribute("data-orientation")).toBe("vertical");
    });

    test("defaults splitPercent to 50", () => {
        const { container } = render(
            <Subject label="Editor" primary={<div>P</div>} secondary={<div>S</div>} />
        );

        const root: HTMLElement | null = container.querySelector(".split-view");
        expect(root?.getAttribute("data-split-percent")).toBe("50");
    });

    test("uses a custom splitPercent", () => {
        const { container } = render(
            <Subject
            label="Editor"
            splitPercent={75}
            primary={<div>P</div>}
            secondary={<div>S</div>}
            />
        );

        const root: HTMLElement | null = container.querySelector(".split-view");
        expect(root?.getAttribute("data-split-percent")).toBe("75");
    });

    test("renders primary and secondary sections", () => {
        render(
            <Subject
            label="Editor"
            primary={<div>Primary content</div>}
            secondary={<div>Secondary content</div>}
            />
        );

        expect(screen.getByText("Primary content")).toBeTruthy();
        expect(screen.getByText("Secondary content")).toBeTruthy();
    });

    test("renders a default separator when no divider is provided", () => {
        render(
            <Subject label="Editor" primary={<div>P</div>} secondary={<div>S</div>} />
        );

        const separator: HTMLElement = screen.getByRole("separator");
        expect(separator).toBeTruthy();
        expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
        expect(separator.getAttribute("aria-valuenow")).toBe("50");
        expect(separator.getAttribute("aria-valuemin")).toBe("0");
        expect(separator.getAttribute("aria-valuemax")).toBe("100");
        expect(separator.getAttribute("tabindex")).toBe("0");
    });

    test("uses a custom divider when provided", () => {
        render(
            <Subject
            label="Editor"
            primary={<div>P</div>}
            secondary={<div>S</div>}
            divider={<div data-testid="custom-divider">My divider</div>}
            />
        );

        expect(screen.getByTestId("custom-divider")).toBeTruthy();
        expect(screen.queryByRole("separator")).toBeNull();
    });

    test("default separator aria-orientation matches the prop", () => {
        render(
            <Subject
            label="Editor"
            orientation="vertical"
            primary={<div>P</div>}
            secondary={<div>S</div>}
            />
        );

        const separator: HTMLElement = screen.getByRole("separator");
        expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    });
});
