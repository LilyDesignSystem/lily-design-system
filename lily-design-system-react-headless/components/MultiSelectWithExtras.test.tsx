import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, test } from "vitest";

import Subject from "./MultiSelectWithExtras";

const options = (
    <>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
    </>
);

function select() {
    return screen.getByLabelText("Pick") as HTMLSelectElement;
}

describe("MultiSelectWithExtras", () => {
    test("wrapper div carries the base class; select is multiple", () => {
        const { container } = render(<Subject label="Pick">{options}</Subject>);
        const root = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toContain("multi-select-with-extras");
        expect(select().multiple).toBe(true);
    });

    test("aria-label is on the select, not the wrapper", () => {
        const { container } = render(<Subject label="Pick">{options}</Subject>);
        expect(select().tagName).toBe("SELECT");
        expect((container.firstElementChild as HTMLElement).getAttribute("aria-label")).toBeNull();
    });

    test("renders before and after around the select in order", () => {
        const { container } = render(
            <Subject label="Pick" before={<span>BEFORE</span>} after={<span>AFTER</span>}>{options}</Subject>,
        );
        const kids = Array.from((container.firstElementChild as HTMLElement).children).map(
            (c) => c.tagName + ":" + c.textContent?.slice(0, 6),
        );
        expect(kids[0]).toBe("SPAN:BEFORE");
        expect(kids[1].startsWith("SELECT")).toBe(true);
        expect(kids[2]).toBe("SPAN:AFTER");
    });

    test("initial array value selects options", () => {
        render(<Subject label="Pick" value={["b"]}>{options}</Subject>);
        expect(Array.from(select().selectedOptions).map((o) => o.value)).toEqual(["b"]);
    });

    test("multiple options can be selected and reported", async () => {
        const user = userEvent.setup();
        const seen: string[][] = [];
        render(<Subject label="Pick" onChange={(v) => seen.push(v)}>{options}</Subject>);
        await user.selectOptions(select(), ["a", "b"]);
        expect(select().selectedOptions).toHaveLength(2);
        expect(seen[seen.length - 1]).toEqual(["a", "b"]);
    });

    test("size, required and disabled reach the select", () => {
        render(<Subject label="Pick" size={5} required disabled>{options}</Subject>);
        expect(select().getAttribute("size")).toBe("5");
        expect(select().required).toBe(true);
        expect(select().disabled).toBe(true);
    });

    test("rest props land on the wrapper", () => {
        const { container } = render(<Subject label="Pick" data-testid="x">{options}</Subject>);
        expect(screen.getByTestId("x")).toBe(container.firstElementChild);
    });
});
