import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SplitView.vue";


describe("SplitView", () => {
    test("has split-view class on root", () => {
        const { container } = render(Subject, {
            props: { label: "Editor" },
            slots: { primary: "<div>L</div>", secondary: "<div>R</div>" },
        });

        const root = container.firstElementChild as HTMLElement;
        expect(root.classList.contains("split-view")).toBe(true);
    });

    test("aria-label matches the label prop", () => {
        const { container } = render(Subject, {
            props: { label: "Editor" },
            slots: { primary: "<div>L</div>", secondary: "<div>R</div>" },
        });

        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Editor");
    });

    test("renders primary and secondary slots", () => {
        render(Subject, {
            props: { label: "Editor" },
            slots: { primary: "<span>primary content</span>", secondary: "<span>secondary content</span>" },
        });

        expect(screen.getByText("primary content")).toBeTruthy();
        expect(screen.getByText("secondary content")).toBeTruthy();
    });

    test("default divider has role separator with orientation and value", () => {
        render(Subject, {
            props: { label: "Editor", orientation: "vertical", splitPercent: 60 },
            slots: { primary: "<div>L</div>", secondary: "<div>R</div>" },
        });

        const sep: HTMLElement = screen.getByRole("separator");
        expect(sep.classList.contains("split-view-divider")).toBe(true);
        expect(sep.getAttribute("aria-orientation")).toBe("vertical");
        expect(sep.getAttribute("aria-valuenow")).toBe("60");
        expect(sep.getAttribute("aria-valuemin")).toBe("0");
        expect(sep.getAttribute("aria-valuemax")).toBe("100");
        expect(sep.getAttribute("tabindex")).toBe("0");
    });

    test("default split percent is 50", () => {
        render(Subject, {
            props: { label: "Editor" },
            slots: { primary: "<div>L</div>", secondary: "<div>R</div>" },
        });

        const sep: HTMLElement = screen.getByRole("separator");
        expect(sep.getAttribute("aria-valuenow")).toBe("50");
    });

    test("default orientation is horizontal", () => {
        const { container } = render(Subject, {
            props: { label: "Editor" },
            slots: { primary: "<div>L</div>", secondary: "<div>R</div>" },
        });

        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-orientation")).toBe("horizontal");
    });

    test("data-split-percent is exposed", () => {
        const { container } = render(Subject, {
            props: { label: "Editor", splitPercent: 75 },
            slots: { primary: "<div>L</div>", secondary: "<div>R</div>" },
        });

        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-split-percent")).toBe("75");
    });

    test("custom divider slot replaces default separator", () => {
        render(Subject, {
            props: { label: "Editor" },
            slots: {
                primary: "<div>L</div>",
                divider: "<div data-testid=\"custom-divider\">CUSTOM</div>",
                secondary: "<div>R</div>",
            },
        });

        expect(screen.queryByRole("separator")).toBeNull();
        expect(screen.getByText("CUSTOM")).toBeTruthy();
    });
});
