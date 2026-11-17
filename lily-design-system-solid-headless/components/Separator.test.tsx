import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./Separator";

describe("Separator", () => {
    test("renders with separator role", () => {
        render(() => <Subject />);
        expect(screen.getByRole("separator")).toBeTruthy();
    });

    test("renders as hr element", () => {
        render(() => <Subject data-testid="sep" />);
        expect(screen.getByTestId("sep").tagName).toBe("HR");
    });

    test("supports optional label", () => {
        render(() => <Subject label="Section break" />);
        expect(screen.getByRole("separator").getAttribute("aria-label")).toBe("Section break");
    });

    test("has no label by default", () => {
        render(() => <Subject />);
        expect(screen.getByRole("separator").getAttribute("aria-label")).toBeNull();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="sep" />);
        expect(screen.getByTestId("sep")).toBeTruthy();
    });
});
