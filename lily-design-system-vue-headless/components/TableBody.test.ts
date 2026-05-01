import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./TableBody.vue";

function renderIn(props: Record<string, unknown> = {}, slotContent: string = `<tr><td>cell</td></tr>`) {
    const container = document.createElement("div");
    const wrapper = document.createElement("table");
    
    container.appendChild(wrapper);
    document.body.appendChild(container);
    const target = wrapper;
    const result = render(Subject, { props, slots: { default: slotContent }, target });
    return { ...result, container };
}

describe("TableBody", () => {
    test("renders a tbody element", () => {
        renderIn();
        const el = document.querySelector("tbody");
        expect(el).toBeTruthy();
    });

    test("applies class table-body", () => {
        renderIn();
        const el = document.querySelector("tbody");
        expect(el?.getAttribute("class")).toContain("table-body");
    });
});
