import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TableRow.vue";

function renderIn(props: Record<string, unknown> = {}, slotContent: string = `<td>cell</td>`) {
    const container = document.createElement("div");
    const wrapper = document.createElement("table");
    const inner = document.createElement('tbody'); wrapper.appendChild(inner);
    container.appendChild(wrapper);
    document.body.appendChild(container);
    const target = inner;
    const result = render(Subject, { props, slots: { default: slotContent }, target });
    return { ...result, container };
}

describe("TableRow", () => {
    test("renders a tr element", () => {
        renderIn();
        const el = document.querySelector("tr");
        expect(el).toBeTruthy();
    });

    test("applies class table-row", () => {
        renderIn();
        const el = document.querySelector("tr");
        expect(el?.getAttribute("class")).toContain("table-row");
    });
});
