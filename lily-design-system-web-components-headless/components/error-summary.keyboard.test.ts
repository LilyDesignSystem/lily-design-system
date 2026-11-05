import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { ErrorSummary } from "./error-summary.js";

if (!customElements.get("lily-error-summary"))
    customElements.define("lily-error-summary", ErrorSummary);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ErrorSummary keyboard", () => {
    test("Tab reaches its links, and it can take focus itself", async () => {
        document.body.innerHTML =
            '<lily-error-summary title="There is a problem"><a href="#name">Enter your name</a></lily-error-summary>';
        const user = userEvent.setup();
        await user.tab();
        const link = document.activeElement as HTMLElement;
        expect(link.textContent).toBe("Enter your name");
        const root = link.closest(".error-summary") as HTMLElement;
        expect(root.getAttribute("role")).toBe("alert");
        expect(root.getAttribute("aria-labelledby")).toBe(root.querySelector("h2")?.id);
        expect(root.getAttribute("tabindex")).toBe("-1");
        root.focus();
        expect(document.activeElement).toBe(root);
    });
});
