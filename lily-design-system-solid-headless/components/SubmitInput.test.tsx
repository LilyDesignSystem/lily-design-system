import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./SubmitInput";

describe("SubmitInput", () => {
    test("renders a submit button", () => {
        render(() => <Subject />);
        const input = screen.getByDisplayValue("Submit") as HTMLInputElement;
        expect(input.type).toBe("submit");
    });

    test("has default value text", () => {
        render(() => <Subject />);
        expect(screen.getByDisplayValue("Submit")).toBeTruthy();
    });

    test("supports custom value text", () => {
        render(() => <Subject value="Send" />);
        expect(screen.getByDisplayValue("Send")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(() => <Subject disabled />);
        expect((screen.getByDisplayValue("Submit") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="si" />);
        expect(screen.getByTestId("si")).toBeTruthy();
    });
});
