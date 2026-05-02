import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "./Diff.vue";

describe("Diff", () => {
    test("renders a div with class diff", () => {
        const { container } = render(Subject, {
            props: { label: "Code comparison" },
            slots: { default: "<div>A</div><div>B</div>" },
        });
        const root = container.querySelector(".diff");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=group with aria-label", () => {
        render(Subject, {
            props: { label: "Code comparison" },
            slots: { default: "<div>A</div><div>B</div>" },
        });
        const group = screen.getByRole("group", { name: "Code comparison" });
        expect(group).toBeTruthy();
    });

    test("renders both children", () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "<div>before</div><div>after</div>" },
        });
        expect(container.textContent).toContain("before");
        expect(container.textContent).toContain("after");
    });
});
