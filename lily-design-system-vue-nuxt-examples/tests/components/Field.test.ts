import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Field.vue";

describe("Field", () => {
    test("renders label", () => {
        render(Subject, { props: { label: "Name" }, slots: { default: "input" } });
        expect(screen.getByText("Name")).toBeTruthy();
    });

    test("renders description", () => {
        render(Subject, {
            props: { label: "Name", description: "Full name" },
            slots: { default: "input" },
        });
        expect(screen.getByText("Full name")).toBeTruthy();
    });

    test("renders error with alert role", () => {
        render(Subject, {
            props: { label: "Name", error: "Required" },
            slots: { default: "input" },
        });
        expect(screen.getByRole("alert").textContent).toBe("Required");
    });

    test("shows required indicator", () => {
        render(Subject, { props: { label: "Name", required: true }, slots: { default: "input" } });
        expect(screen.getByText("*")).toBeTruthy();
    });

    test("required indicator is aria-hidden", () => {
        render(Subject, { props: { label: "Name", required: true }, slots: { default: "input" } });
        expect(screen.getByText("*").closest("[aria-hidden]")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "f" }, slots: { default: "C" } });
        expect(screen.getByTestId("f")).toBeTruthy();
    });
});
