import { afterEach, describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { DecisionSupportCard } from "./decision-support-card.js";

if (!customElements.get("lily-decision-support-card"))
    customElements.define("lily-decision-support-card", DecisionSupportCard);

afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body;
}

describe("DecisionSupportCard", () => {
    const base = `summary="Penicillin allergy recorded" indicator="critical" indicator-label="Critical" source-label="Local formulary"`;

    test("renders a group named by its summary, not a live region, with its detail", () => {
        const body = render(
            `<lily-decision-support-card ${base}><p>Amoxicillin is a penicillin.</p></lily-decision-support-card>`,
        );
        const card = body.querySelector("div.decision-support-card") as HTMLElement;
        expect(card.getAttribute("role")).toBe("group");
        expect(card.getAttribute("aria-label")).toBe("Penicillin allergy recorded");
        expect(card.getAttribute("data-indicator")).toBe("critical");
        expect(card.hasAttribute("aria-live")).toBe(false);
        expect(card.querySelector(".decision-support-card-detail")?.textContent).toBe(
            "Amoxicillin is a penicillin.",
        );
        expect(card.querySelector("button")).toBeNull();
    });

    test("a suggestion is a button, chosen with Enter or Space", async () => {
        const user = userEvent.setup();
        const body = render(
            `<lily-decision-support-card ${base} suggestions=\x27[{"id":"cancel","label":"Cancel amoxicillin","isRecommended":true},{"id":"switch","label":"Prescribe clarithromycin"}]\x27></lily-decision-support-card>`,
        );
        const chosen: string[] = [];
        body.addEventListener("suggestion", (e) => chosen.push((e as CustomEvent).detail.id));
        const first = body.querySelector(".decision-support-card-suggestion") as HTMLButtonElement;
        expect(first.getAttribute("data-recommended")).toBe("true");
        first.focus();
        await user.keyboard("{Enter}");
        await user.tab();
        await user.keyboard(" ");
        expect(chosen).toEqual(["cancel", "switch"]);
    });

    test("dismissing without a reason is refused when reasons are offered", async () => {
        const user = userEvent.setup();
        const body = render(
            `<lily-decision-support-card ${base} dismiss-label="Dismiss" override-reasons=\x27[{"code":"error","display":"Allergy recorded in error"}]\x27 override-reason-label="Reason for dismissing" override-reason-placeholder="Choose a reason"></lily-decision-support-card>`,
        );
        const dismissed: unknown[] = [];
        body.addEventListener("dismiss", (e) => dismissed.push((e as CustomEvent).detail.reason));
        const select = body.querySelector("select") as HTMLSelectElement;
        const button = body.querySelector(".decision-support-card-dismiss") as HTMLButtonElement;
        button.focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual([]);
        expect(select.getAttribute("aria-invalid")).toBe("true");
        expect(document.activeElement).toBe(select);
        await user.selectOptions(select, "error");
        button.focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual(["error"]);
    });
});
