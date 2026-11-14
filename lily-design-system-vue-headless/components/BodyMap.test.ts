import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./BodyMap.vue";

const regions = [
    { id: "head", label: "Head" },
    { id: "left-arm", label: "Left arm" },
];
const drawing =
    '<svg viewBox="0 0 10 10"><circle data-region="head" r="2" cx="5" cy="2"></circle><rect data-region="left-arm" x="0" y="4" width="2" height="4"></rect></svg>';

describe("BodyMap", () => {
    test("is a fieldset named by its legend, its drawing hidden, its regions checkboxes", () => {
        render(Subject, {
            props: { label: "Where is the pain?", regions },
            slots: { default: drawing },
        });
        const group = screen.getByRole("group", { name: "Where is the pain?" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.querySelector(".body-map-figure")?.getAttribute("aria-hidden")).toBe("true");
        expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    });

    test("Space toggles a region; a click on a shape toggles too; v-model follows", async () => {
        const user = userEvent.setup();
        const { emitted } = render(Subject, {
            props: { label: "Where is the pain?", regions },
            slots: { default: drawing },
        });
        screen.getByRole("checkbox", { name: "Head" }).focus();
        await user.keyboard(" ");
        expect(emitted()["update:selected"]?.at(-1)).toEqual([["head"]]);
        await user.click(document.querySelector('rect[data-region="left-arm"]') as Element);
        expect(emitted()["update:selected"]?.at(-1)).toEqual([["head", "left-arm"]]);
    });

    test("a bound selection shows on the checkboxes, the drawing and the form", () => {
        render(Subject, {
            props: { label: "Where is the pain?", regions, selected: ["head"], name: "sites" },
            slots: { default: drawing },
        });
        expect((screen.getByRole("checkbox", { name: "Head" }) as HTMLInputElement).checked).toBe(
            true,
        );
        expect(
            document.querySelector('circle[data-region="head"]')?.getAttribute("data-selected"),
        ).toBe("true");
        expect(
            (document.querySelector('input[name="sites"]:checked') as HTMLInputElement).value,
        ).toBe("head");
    });
});
