import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./InfoState";

describe("InfoState", () => {
    test("renders a <section> with role=status and the title heading", () => {
        render(<Subject title="No results" />);

        const status: HTMLElement = screen.getByRole("status");
        expect(status.tagName).toBe("SECTION");
        expect(status.className.includes("info-state")).toBe(true);

        const heading: HTMLElement = screen.getByRole("heading", { level: 2 });
        expect(heading.textContent).toBe("No results");
    });

    test("defaults to level=info", () => {
        render(<Subject title="Hello" />);

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("data-level")).toBe("info");
    });

    test("accepts a custom level value", () => {
        render(<Subject level="error" title="Boom" />);

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("data-level")).toBe("error");
    });

    test("renders description paragraph when provided", () => {
        render(<Subject title="Title" description="Body text." />);

        expect(screen.getByText("Body text.")).toBeTruthy();
    });

    test("renders illustration and action regions", () => {
        render(
            <Subject
                title="Title"
                illustration={<span data-testid="illu">illu</span>}
                action={<button>Retry</button>}
            />,
        );

        expect(screen.getByTestId("illu")).toBeTruthy();
        expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
    });

    test("aria-label defaults to title when label not provided", () => {
        render(<Subject title="No results" />);

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("aria-label")).toBe("No results");
    });

    test("aria-label override via label prop", () => {
        render(<Subject title="No results" label="Empty inbox" />);

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("aria-label")).toBe("Empty inbox");
    });

    test("children replace the default layout", () => {
        render(
            <Subject title="Ignored">
                <p>Custom content.</p>
            </Subject>,
        );

        expect(screen.getByText("Custom content.")).toBeTruthy();
        expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    });
});
