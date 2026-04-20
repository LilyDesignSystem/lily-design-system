import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationList.vue";


describe("PaginationList", () => {
    test("renders an ordered list", () => {
        render(Subject, { slots: { default: "<a>1</a><a>2</a>" } });
        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has aria-label when provided", () => {
        render(Subject, { props: { label: "Pages" }, slots: { default: "<a>1</a><a>2</a>" } });
        expect(screen.getByLabelText("Pages")).toBeTruthy();
    });

    test("renders children links", () => {
        render(Subject, { slots: { default: "<a>1</a><a>2</a>" } });
        expect(screen.getByText("1")).toBeTruthy();
        expect(screen.getByText("2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "pg" }, slots: { default: "<a>1</a><a>2</a>" } });
        expect(screen.getByTestId("pg")).toBeTruthy();
    });
});
