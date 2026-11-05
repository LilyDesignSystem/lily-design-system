import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TabPanel";

describe("TabPanel keyboard", () => {
    test("Tab moves focus into the selected panel", async () => {
        render(
            <Subject
                label="Details"
                selected
            >
                Panel text
            </Subject>,
        );
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLElement;
        expect(el.matches(".tab-panel")).toBe(true);
        expect(el.getAttribute("role")).toBe("tabpanel");
        expect(el.getAttribute("aria-label")).toBe("Details");
    });
});
