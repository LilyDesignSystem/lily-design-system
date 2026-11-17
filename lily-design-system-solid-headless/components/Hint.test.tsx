import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./Hint";

describe("Hint", () => {
    test("renders hint text", () => {
        render(() => <Subject>Enter email</Subject>);
        expect(screen.getByText("Enter email")).toBeTruthy();
    });

    test("has id for linking", () => {
        render(() => <Subject id="hint-1">Help</Subject>);
        expect(document.getElementById("hint-1")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="h">H</Subject>);
        expect(screen.getByTestId("h")).toBeTruthy();
    });
});
