import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./ResetInput";

describe("ResetInput", () => {
    test("renders a reset button", () => {
        render(() => <Subject />);
        const input = screen.getByDisplayValue("Reset") as HTMLInputElement;
        expect(input.type).toBe("reset");
    });

    test("has default value text", () => {
        render(() => <Subject />);
        expect(screen.getByDisplayValue("Reset")).toBeTruthy();
    });

    test("supports custom value text", () => {
        render(() => <Subject value="Clear form" />);
        expect(screen.getByDisplayValue("Clear form")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(() => <Subject disabled />);
        expect((screen.getByDisplayValue("Reset") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="ri" />);
        expect(screen.getByTestId("ri")).toBeTruthy();
    });
});
