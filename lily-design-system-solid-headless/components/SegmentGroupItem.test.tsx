import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./SegmentGroupItem";

describe("SegmentGroupItem", () => {
    test("renders a radio button", () => {
        render(() => <Subject>Grid</Subject>);
        expect(screen.getByRole("radio")).toBeTruthy();
    });

    test("has aria-checked false by default", () => {
        render(() => <Subject>Grid</Subject>);
        expect(screen.getByRole("radio").getAttribute("aria-checked")).toBe("false");
    });

    test("has aria-checked true when checked", () => {
        render(() => <Subject checked>Grid</Subject>);
        expect(screen.getByRole("radio").getAttribute("aria-checked")).toBe("true");
    });

    test("has tabindex -1 when not checked", () => {
        render(() => <Subject>Grid</Subject>);
        expect(screen.getByRole("radio").getAttribute("tabindex")).toBe("-1");
    });

    test("has tabindex 0 when checked", () => {
        render(() => <Subject checked>Grid</Subject>);
        expect(screen.getByRole("radio").getAttribute("tabindex")).toBe("0");
    });

    test("has data-value attribute", () => {
        render(() => <Subject value="grid">Grid</Subject>);
        expect(screen.getByRole("radio").getAttribute("data-value")).toBe("grid");
    });

    test("is not disabled by default", () => {
        render(() => <Subject>Grid</Subject>);
        expect((screen.getByRole("radio") as HTMLButtonElement).disabled).toBe(false);
    });

    test("supports disabled state", () => {
        render(() => <Subject disabled>Grid</Subject>);
        expect((screen.getByRole("radio") as HTMLButtonElement).disabled).toBe(true);
    });

    test("renders children", () => {
        render(() => <Subject>List View</Subject>);
        expect(screen.getByText("List View")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="sgi">x</Subject>);
        expect(screen.getByTestId("sgi")).toBeTruthy();
    });
});
