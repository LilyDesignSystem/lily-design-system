import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationList.svelte";

function pagesSnippet() {
    return (($anchor: Comment) => {
        const li1 = document.createElement("li");
        const a1 = document.createElement("a");
        a1.href = "/page/1";
        a1.textContent = "1";
        li1.appendChild(a1);
        const li2 = document.createElement("li");
        const a2 = document.createElement("a");
        a2.href = "/page/2";
        a2.textContent = "2";
        a2.setAttribute("aria-current", "page");
        li2.appendChild(a2);
        $anchor.before(li1, li2);
    }) as any;
}

describe("PaginationList", () => {
    test("renders a navigation", () => {
        render(Subject, { props: { label: "Pagination", children: pagesSnippet() } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Pages", children: pagesSnippet() } });
        expect(screen.getByLabelText("Pages")).toBeTruthy();
    });

    test("contains a list", () => {
        render(Subject, { props: { label: "Pagination", children: pagesSnippet() } });
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("renders children links", () => {
        render(Subject, { props: { label: "Pagination", children: pagesSnippet() } });
        expect(screen.getByText("1")).toBeTruthy();
        expect(screen.getByText("2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", "data-testid": "pg", children: pagesSnippet() } });
        expect(screen.getByTestId("pg")).toBeTruthy();
    });
});
