import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";
import Subject from "./MockupPhoneLandscape";

describe("MockupPhoneLandscape", () => {
    test("renders root with class mockup-phone-landscape", () => {
        const { container } = render(() => <Subject label="Test">Body</Subject>);
        expect(container.querySelector(".mockup-phone-landscape")).toBeTruthy();
    });
});
