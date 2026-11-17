import { createSignal, flush, omit } from "solid-js";
import { describe, expect, test } from "vitest";

import { withDefaults } from "./defaults";

describe("withDefaults", () => {
    test("a default applies when the prop is missing or undefined, and the prop wins otherwise", () => {
        const p = withDefaults({ type: "button", min: 0 }, { type: undefined, min: 3 } as {
            type?: string;
            min?: number;
        });
        expect(p.type).toBe("button");
        expect(p.min).toBe(3);
    });

    test("stays reactive and keeps props that have no default", () => {
        const [type, setType] = createSignal<string | undefined>("submit");
        const props = {
            get type() {
                return type();
            },
            label: "Save",
        };
        const p = withDefaults({ type: "button" }, props);
        expect(p.type).toBe("submit");
        expect(p.label).toBe("Save");
        setType(undefined);
        flush();
        expect(p.type).toBe("button");
    });

    test("works with omit for the rest props", () => {
        const p = withDefaults({ class: "" }, { class: undefined, id: "x" } as {
            class?: string;
            id?: string;
        });
        const rest = omit(p, "class");
        expect(Object.keys(rest)).toEqual(["id"]);
    });
});
