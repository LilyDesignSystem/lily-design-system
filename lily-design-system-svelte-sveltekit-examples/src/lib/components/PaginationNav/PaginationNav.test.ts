import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PaginationNav from "./PaginationNav.svelte";

describe("PaginationNav", () => {
    test("renders the component", () => {
        render(PaginationNav, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
