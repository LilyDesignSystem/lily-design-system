import { afterEach, describe, expect, test } from "vitest";

import { Statistic } from "./statistic.js";

if (!customElements.get("lily-statistic")) {
    customElements.define("lily-statistic", Statistic);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Statistic", () => {
    test("carries the base class and role=group", () => {
        const host = render('<lily-statistic title="Active users" value="12,345"></lily-statistic>');

        expect(host.classList.contains("statistic")).toBe(true);
        expect(host.getAttribute("role")).toBe("group");
    });

    test("defaults aria-label to '{title}: {value}'", () => {
        const host = render('<lily-statistic title="Active users" value="12,345"></lily-statistic>');

        expect(host.getAttribute("aria-label")).toBe("Active users: 12,345");
    });

    test("an explicit label overrides the default aria-label", () => {
        const host = render(
            '<lily-statistic title="Conversion" value="4.2" suffix="%" label="Conversion rate is 4.2 percent"></lily-statistic>',
        );

        expect(host.getAttribute("aria-label")).toBe("Conversion rate is 4.2 percent");
    });

    test("renders title inside .statistic-title", () => {
        const host = render('<lily-statistic title="Revenue" value="2,400"></lily-statistic>');

        expect(host.querySelector(".statistic-title")?.textContent).toBe("Revenue");
    });

    test("renders value inside .statistic-value", () => {
        const host = render('<lily-statistic title="Revenue" value="2,400"></lily-statistic>');

        expect(host.querySelector(".statistic-value")?.textContent).toContain("2,400");
    });

    test("renders prefix and suffix only when provided", () => {
        const withBoth = render('<lily-statistic title="Revenue" value="2,400" prefix="$" suffix="K"></lily-statistic>');

        expect(withBoth.querySelector(".statistic-prefix")?.textContent).toBe("$");
        expect(withBoth.querySelector(".statistic-suffix")?.textContent).toBe("K");

        document.body.innerHTML = "";

        const withNeither = render('<lily-statistic title="Revenue" value="2,400"></lily-statistic>');

        expect(withNeither.querySelector(".statistic-prefix")).toBeNull();
        expect(withNeither.querySelector(".statistic-suffix")).toBeNull();
    });
});
