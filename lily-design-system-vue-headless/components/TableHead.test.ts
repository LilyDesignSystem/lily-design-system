import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TableHead.vue";

function renderIn(props: Record<string, unknown> = {}, slotContent: string = `<tr><td>cell</td></tr>`) {
    const container = document.createElement("div");
    const wrapper = document.createElement("table");
    
    container.appendChild(wrapper);
    document.body.appendChild(container);
    const target = wrapper;
    const result = render(Subject, { props, slots: { default: slotContent }, target });
    return { ...result, container };
}

describe("TableHead", () => {
    test("renders a thead element", () => {
        renderIn();
        const el = document.querySelector("thead");
        expect(el).toBeTruthy();
    });

    test("applies class table-head", () => {
        renderIn();
        const el = document.querySelector("thead");
        expect(el?.getAttribute("class")).toContain("table-head");
    });
});
