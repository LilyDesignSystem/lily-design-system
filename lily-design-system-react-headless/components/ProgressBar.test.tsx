import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./ProgressBar";

describe("ProgressBar", () => {
    test("renders root with class progress-bar", () => {
        const { container } = render(<Subject value={42} label="Test" />);
        expect(container.querySelector(".progress-bar")).toBeTruthy();
    });
});
