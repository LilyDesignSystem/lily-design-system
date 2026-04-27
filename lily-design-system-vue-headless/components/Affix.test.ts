import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Affix.vue";


describe("Affix", () => {
    test("renders a div with affix class on root", () => {
        const { container } = render(Subject, { slots: { default: "content" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("affix")).toBe(true);
    });

    test("renders default slot content", () => {
        const { container } = render(Subject, { slots: { default: "<span>hello</span>" } });

        expect(container.textContent).toContain("hello");
    });

    test("applies position sticky inline style", () => {
        const { container } = render(Subject, { slots: { default: "x" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.style.position).toBe("sticky");
    });

    test("defaults to top: 0 when neither offset is provided", () => {
        const { container } = render(Subject, { slots: { default: "x" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.style.top).toBe("0px");
    });

    test("applies offsetTop as inline top style and data attribute", () => {
        const { container } = render(Subject, {
            props: { offsetTop: 24 },
            slots: { default: "x" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.style.top).toBe("24px");
        expect(root.getAttribute("data-offset-top")).toBe("24");
    });

    test("applies offsetBottom as inline bottom style and data attribute", () => {
        const { container } = render(Subject, {
            props: { offsetBottom: 16 },
            slots: { default: "x" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.style.bottom).toBe("16px");
        expect(root.getAttribute("data-offset-bottom")).toBe("16");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { id: "sticky-1" },
            slots: { default: "x" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("id")).toBe("sticky-1");
    });
});
