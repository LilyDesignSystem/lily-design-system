import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import type { Component as SolidComponent } from "solid-js";
import Component from "./TextInputWithSearch";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as SolidComponent<Record<string, unknown>>;

describe("TextInputWithSearch", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(() => <Subject label="Demo" />);
        const el = container.querySelector(".text-input-with-search");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(() => (
            <Subject
                label="Demo"
                class="extra"
            />
        ));
        const el = container.querySelector(".text-input-with-search");
        expect(el?.className).toContain("text-input-with-search");
        expect(el?.className).toContain("extra");
    });
});
