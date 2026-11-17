import { render } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./DurationView.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

const root = (container: Element) => container.querySelector(".duration-view") as HTMLElement;

describe("DurationView", () => {
    test("renders a time whose datetime is the duration, holding the consumer's words", () => {
        const { container } = render(Subject, {
            props: { value: "3 days 4 hours", duration: "P3DT4H" },
        });
        expect(root(container).tagName).toBe("TIME");
        expect(root(container).getAttribute("datetime")).toBe("P3DT4H");
        expect(root(container).textContent).toBe("3 days 4 hours");
    });

    test("a negative duration keeps its length as datetime and is marked data-negative", () => {
        const { container } = render(Subject, {
            props: { value: "3 days early", duration: "-P3D" },
        });
        expect(root(container).getAttribute("datetime")).toBe("P3D");
        expect(root(container).hasAttribute("data-negative")).toBe(true);
    });

    test("a duration in years is no datetime, and warns", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { container } = render(Subject, { props: { value: "2 years", duration: "P2Y" } });
        expect(root(container).hasAttribute("datetime")).toBe(false);
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("DurationView has no duration"));
    });

    test("names the value with hidden text when a label is given", () => {
        const { container } = render(Subject, {
            props: { value: "4 days", duration: "P4D", label: "Length of stay" },
        });
        expect(root(container).textContent).toBe("Length of stay 4 days");
    });
});
