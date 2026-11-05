import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Hint.vue";

describe("Hint keyboard", () => {
    test("aria-describedby can point a control at it", async () => {
        render(Subject, {
            props: { id: "name-hint", label: "Hint" },
            slots: { default: "Use your full name" },
        });

        document.body.insertAdjacentHTML("beforeend", '<input aria-describedby="name-hint" />');
        const input = document.querySelector("[aria-describedby]");
        const target = document.getElementById(input?.getAttribute("aria-describedby") ?? "");
        expect(target?.textContent).toContain("Use your full name");
    });
});
