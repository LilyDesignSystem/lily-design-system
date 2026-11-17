import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./GrailLayoutCenterMain";

describe("GrailLayoutCenterMain", () => {
    test("renders a div", () => {
        render(() => <Subject>Content</Subject>);
        expect(document.querySelector(".grail-layout-center-main")).toBeTruthy();
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
