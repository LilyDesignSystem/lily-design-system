import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, test } from "vitest";

import Subject from "./StepListItem";

describe("StepListItem", () => {
    function renderInList(child: ReactElement) {
        return render(<ol>{child}</ol>);
    }

    test("renders a <li> with the step-list-item root class", () => {
        const { container } = renderInList(<Subject>Step</Subject>);

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li).toBeTruthy();
        expect(li.tagName).toBe("LI");
    });

    test("defaults status to waiting", () => {
        const { container } = renderInList(<Subject>x</Subject>);

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li.getAttribute("data-status")).toBe("waiting");
    });

    test("supports each status", () => {
        const statuses: Array<"waiting" | "in-progress" | "finished" | "error"> = [
            "waiting",
            "in-progress",
            "finished",
            "error",
        ];
        for (const s of statuses) {
            const { container } = renderInList(<Subject status={s}>x</Subject>);
            const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
            expect(li.getAttribute("data-status")).toBe(s);
        }
    });

    test("aria-current=step when current=true", () => {
        const { container } = renderInList(<Subject current>x</Subject>);

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li.getAttribute("aria-current")).toBe("step");
    });

    test("no aria-current when current=false", () => {
        const { container } = renderInList(<Subject>x</Subject>);

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li.getAttribute("aria-current")).toBeNull();
    });

    test("supports aria-label override", () => {
        const { container } = renderInList(
            <Subject label="Step 2 of 3: Profile">x</Subject>
        );

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li.getAttribute("aria-label")).toBe("Step 2 of 3: Profile");
    });

    test("renders children", () => {
        const { container } = renderInList(<Subject>step content</Subject>);

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li.textContent).toBe("step content");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = renderInList(<Subject id="step-2">x</Subject>);

        const li: HTMLElement = container.querySelector(".step-list-item") as HTMLElement;
        expect(li.getAttribute("id")).toBe("step-2");
    });
});
