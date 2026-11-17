import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutRightAside";

describe("GrailLayoutRightAside", () => {
    test("renders a div", () => {
        render(() => <Subject>Content</Subject>);
        expect(document.querySelector(".grail-layout-right-aside")).toBeTruthy();
    });

    test("renders children", () => {
        render(() => <Subject>Content</Subject>);
        expect(screen.getByText("Content")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(() => <Subject data-testid="test">Content</Subject>);
        expect(screen.getByTestId("test")).toBeTruthy();
    });
});
