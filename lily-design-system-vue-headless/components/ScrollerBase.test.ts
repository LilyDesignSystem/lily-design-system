import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ScrollerBase.vue";

describe("ScrollerBase", () => {
    test("renders a div with class scroller-base", () => {
        const { container } = render(Subject, {
            slots: { default: "<div>step 1</div><div>step 2</div>" },
        });
        const root = container.querySelector(".scroller-base");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, {
            props: { label: "My story" },
            slots: { default: "<div>1</div>" },
        });
        expect(container.querySelector(".scroller-base")?.getAttribute("aria-label")).toBe("My story");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "<div>1</div>" } });
        expect(container.querySelector(".scroller-base")?.getAttribute("aria-label")).toBeNull();
    });

    test("renders all step children", () => {
        const { container } = render(Subject, {
            slots: { default: "<div>one</div><div>two</div><div>three</div>" },
        });
        const root = container.querySelector(".scroller-base") as HTMLElement;
        expect(root.children.length).toBe(3);
        expect(root.children[2].textContent).toBe("three");
    });
});
