import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./BodyMap";

const regions = [
    { id: "head", label: "Head" },
    { id: "left-arm", label: "Left arm" },
];

function Drawing() {
    return (
        <svg viewBox="0 0 10 10">
            <circle
                data-region="head"
                r="2"
                cx="5"
                cy="2"
            />
            <rect
                data-region="left-arm"
                x="0"
                y="4"
                width="2"
                height="4"
            />
        </svg>
    );
}

describe("BodyMap", () => {
    test("is a fieldset named by its legend, its drawing hidden, its regions checkboxes", () => {
        render(
            <Subject
                label="Where is the pain?"
                regions={regions}
            >
                <Drawing />
            </Subject>,
        );
        const group = screen.getByRole("group", { name: "Where is the pain?" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.querySelector(".body-map-figure")?.getAttribute("aria-hidden")).toBe("true");
        expect(screen.getAllByRole("checkbox").map((c) => (c as HTMLInputElement).checked)).toEqual(
            [false, false],
        );
    });

    test("Space toggles a region and the drawing shows it; a click on a shape toggles too; the form gets both", async () => {
        const user = userEvent.setup();
        render(
            <Subject
                label="Where is the pain?"
                regions={regions}
                name="sites"
            >
                <Drawing />
            </Subject>,
        );
        const head = screen.getByRole("checkbox", { name: "Head" }) as HTMLInputElement;
        head.focus();
        await user.keyboard(" ");
        expect(head.checked).toBe(true);
        expect(
            document.querySelector('circle[data-region="head"]')?.getAttribute("data-selected"),
        ).toBe("true");
        await user.click(document.querySelector('rect[data-region="left-arm"]') as Element);
        expect(
            (screen.getByRole("checkbox", { name: "Left arm" }) as HTMLInputElement).checked,
        ).toBe(true);
        expect(
            [...document.querySelectorAll<HTMLInputElement>('input[name="sites"]:checked')].map(
                (i) => i.value,
            ),
        ).toEqual(["head", "left-arm"]);
    });
});
