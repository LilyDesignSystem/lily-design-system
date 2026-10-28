import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Skeleton.vue";

describe("Skeleton", () => {
    test("renders a div", () => {
        render(Subject, { props: { "data-testid": "sk" } });
        expect(screen.getByTestId("sk").tagName).toBe("DIV");
    });

    test("has aria-hidden true", () => {
        render(Subject, { props: { "data-testid": "sk" } });
        expect(screen.getByTestId("sk").getAttribute("aria-hidden")).toBe("true");
    });

    test("has aria-busy true", () => {
        render(Subject, { props: { "data-testid": "sk" } });
        expect(screen.getByTestId("sk").getAttribute("aria-busy")).toBe("true");
    });

    test("renders children", () => {
        render(Subject, { props: { "data-testid": "sk" }, slots: { default: "Loading..." } });
        expect(screen.getByTestId("sk").textContent).toContain("Loading...");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "sk" } });
        expect(screen.getByTestId("sk")).toBeTruthy();
    });
});
