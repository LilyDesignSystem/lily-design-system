import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Meter";

describe("Meter", () => {
    test("renders as a meter", () => {
        render(
            <Subject
                label="Disk"
                value={50}
            />,
        );
        expect(screen.getByRole("meter")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(
            <Subject
                label="Memory"
                value={60}
            />,
        );
        expect(screen.getByRole("meter").getAttribute("aria-label")).toBe("Memory");
    });

    test("has correct value", () => {
        render(
            <Subject
                label="M"
                value={42}
                data-testid="m"
            />,
        );
        expect((screen.getByTestId("m") as HTMLMeterElement).value).toBe(42);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="M"
                value={10}
                data-testid="m"
            />,
        );
        expect(screen.getByTestId("m")).toBeTruthy();
    });
});
