import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./Container";

describe("Container", () => {
    test("renders root with class container", () => {
        const { container } = render(<Subject>Body</Subject>);
        expect(container.querySelector(".container")).toBeTruthy();
    });
});
