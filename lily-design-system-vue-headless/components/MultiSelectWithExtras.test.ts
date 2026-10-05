import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./MultiSelectWithExtras.vue";

const OPTIONS = '<option value="a">Option A</option><option value="b">Option B</option>';

function select() {
    return screen.getByLabelText("Pick") as HTMLSelectElement;
}

describe("MultiSelectWithExtras", () => {
    test("wrapper div carries the base class; select is multiple", () => {
        const { container } = render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("multi-select-with-extras");
        expect(select().multiple).toBe(true);
    });

    test("aria-label is on the select, not the wrapper", () => {
        const { container } = render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        expect(select().tagName).toBe("SELECT");
        expect((container.firstElementChild as HTMLElement).getAttribute("aria-label")).toBeNull();
    });

    test("renders before and after slots around the select in order", () => {
        const { container } = render(Subject, {
            props: { label: "Pick" },
            slots: { default: OPTIONS, before: "<span>BEFORE</span>", after: "<span>AFTER</span>" },
        });
        const kids = Array.from((container.firstElementChild as HTMLElement).children).map((c) => c.tagName + ":" + c.textContent?.slice(0, 6));
        expect(kids[0]).toBe("SPAN:BEFORE");
        expect(kids[1].startsWith("SELECT")).toBe(true);
        expect(kids[2]).toBe("SPAN:AFTER");
    });

    test("initial array value selects options", () => {
        render(Subject, { props: { label: "Pick", modelValue: ["b"] }, slots: { default: OPTIONS } });
        expect(Array.from(select().selectedOptions).map((o) => o.value)).toEqual(["b"]);
    });

    test("multiple options can be selected", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Pick" }, slots: { default: OPTIONS } });
        await user.selectOptions(select(), ["a", "b"]);
        expect(select().selectedOptions).toHaveLength(2);
    });

    test("size, required and disabled reach the select", () => {
        render(Subject, { props: { label: "Pick", size: 5, required: true, disabled: true }, slots: { default: OPTIONS } });
        expect(select().getAttribute("size")).toBe("5");
        expect(select().required).toBe(true);
        expect(select().disabled).toBe(true);
    });

    test("attributes land on the wrapper", () => {
        const { container } = render(Subject, { props: { label: "Pick", "data-testid": "x" }, slots: { default: OPTIONS } });
        expect(screen.getByTestId("x")).toBe(container.firstElementChild);
    });
});
