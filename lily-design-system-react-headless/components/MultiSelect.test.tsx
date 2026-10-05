import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, test } from "vitest";

import Subject from "./MultiSelect";

const options = (
    <>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
        <option value="c">Option C</option>
    </>
);

function select() {
    return screen.getByLabelText("Pick") as HTMLSelectElement;
}

describe("MultiSelect", () => {
    test("renders a native <select multiple> with the base class", () => {
        render(<Subject label="Pick">{options}</Subject>);
        expect(select().tagName).toBe("SELECT");
        expect(select().multiple).toBe(true);
        expect(select().getAttribute("class")).toContain("multi-select");
    });

    test("is exposed as a listbox", () => {
        render(<Subject label="Pick">{options}</Subject>);
        expect(screen.getByRole("listbox", { name: "Pick" })).toBeTruthy();
    });

    test("renders option children", () => {
        render(<Subject label="Pick">{options}</Subject>);
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    test("initial value array selects the matching options", () => {
        render(<Subject label="Pick" value={["a", "c"]}>{options}</Subject>);
        expect(Array.from(select().selectedOptions).map((o) => o.value)).toEqual(["a", "c"]);
    });

    test("selecting several options works and reports an array", async () => {
        const user = userEvent.setup();
        const seen: string[][] = [];
        render(<Subject label="Pick" onChange={(v) => seen.push(v)}>{options}</Subject>);
        await user.selectOptions(select(), ["a", "b"]);
        expect(Array.from(select().selectedOptions).map((o) => o.value)).toEqual(["a", "b"]);
        expect(seen[seen.length - 1]).toEqual(["a", "b"]);
    });

    test("size sets the visible rows", () => {
        render(<Subject label="Pick" size={4}>{options}</Subject>);
        expect(select().getAttribute("size")).toBe("4");
    });

    test("supports required and disabled", () => {
        render(<Subject label="Pick" required disabled>{options}</Subject>);
        expect(select().required).toBe(true);
        expect(select().disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(<Subject label="Pick" data-testid="ms">{options}</Subject>);
        expect(screen.getByTestId("ms")).toBeTruthy();
    });
});
