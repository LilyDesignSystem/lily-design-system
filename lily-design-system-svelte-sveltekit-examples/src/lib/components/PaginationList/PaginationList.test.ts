import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PaginationList from "./PaginationList.svelte";

describe("PaginationList", () => {
    test("renders the component", () => {
        render(PaginationList, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
