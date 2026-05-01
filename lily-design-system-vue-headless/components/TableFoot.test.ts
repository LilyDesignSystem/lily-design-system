import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TableFoot.vue";

function renderIn(props: Record<string, unknown> = {}, slotContent: string = `<tr><td>cell</td></tr>`) {
    const container = document.createElement("div");
    const wrapper = document.createElement("table");
    
    container.appendChild(wrapper);
    document.body.appendChild(container);
    const target = wrapper;
    const result = render(Subject, { props, slots: { default: slotContent }, target });
    return { ...result, container };
}

describe("TableFoot", () => {
    test("renders a tfoot element", () => {
        renderIn();
        const el = document.querySelector("tfoot");
        expect(el).toBeTruthy();
    });

    test("applies class table-foot", () => {
        renderIn();
        const el = document.querySelector("tfoot");
        expect(el?.getAttribute("class")).toContain("table-foot");
    });
});
