import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TransferList.vue";


describe("TransferList", () => {
    const baseProps = {
        label: "Move items",
        sourceLabel: "Available",
        targetLabel: "Selected",
    };

    test("renders root with transfer-list class and group role", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { source: "<ul>s</ul>", target: "<ul>t</ul>" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("transfer-list")).toBe(true);
        expect(root.getAttribute("role")).toBe("group");
    });

    test("group has aria-label from label prop", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { source: "s", target: "t" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Move items");
    });

    test("renders source section with sourceLabel", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { source: "<ul>source-content</ul>", target: "t" },
        });

        const source: HTMLElement = container.querySelector(".transfer-list-source") as HTMLElement;
        expect(source.tagName).toBe("SECTION");
        expect(source.getAttribute("aria-label")).toBe("Available");
        expect(source.textContent).toContain("source-content");
    });

    test("renders target section with targetLabel", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { source: "s", target: "<ul>target-content</ul>" },
        });

        const target: HTMLElement = container.querySelector(".transfer-list-target") as HTMLElement;
        expect(target.tagName).toBe("SECTION");
        expect(target.getAttribute("aria-label")).toBe("Selected");
        expect(target.textContent).toContain("target-content");
    });

    test("renders actions slot when provided", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: {
                source: "s",
                target: "t",
                actions: "<button>→</button>",
            },
        });

        const actions: HTMLElement = container.querySelector(".transfer-list-actions") as HTMLElement;
        expect(actions).toBeTruthy();
        expect(actions.textContent).toContain("→");
    });

    test("omits actions container when actions slot empty", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { source: "s", target: "t" },
        });

        const actions: HTMLElement | null = container.querySelector(".transfer-list-actions");
        expect(actions).toBeNull();
    });
});
