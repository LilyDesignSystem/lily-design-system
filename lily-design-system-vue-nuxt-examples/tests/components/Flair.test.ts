import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Flair.vue";

describe("Flair", () => {
    test("renders children text", () => {
        render(Subject, { props: { "data-testid": "fl" }, slots: { default: "New" } });
        expect(screen.getByTestId("fl").textContent).toBe("New");
    });

    test("decorative by default (aria-hidden)", () => {
        render(Subject, { props: { "data-testid": "fl" }, slots: { default: "New" } });
        expect(screen.getByTestId("fl").getAttribute("aria-hidden")).toBe("true");
    });

    test("meaningful when label provided", () => {
        render(Subject, {
            props: { label: "Status: new", "data-testid": "fl" },
            slots: { default: "New" },
        });
        expect(screen.getByTestId("fl").getAttribute("aria-label")).toBe("Status: new");
        expect(screen.getByTestId("fl").getAttribute("aria-hidden")).toBeNull();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "fl" }, slots: { default: "X" } });
        expect(screen.getByTestId("fl")).toBeTruthy();
    });
});
