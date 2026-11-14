import { TestBed } from "@angular/core/testing";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { DecisionSupportCard } from "./DecisionSupportCard";

const base = {
    summary: "Penicillin allergy recorded",
    indicator: "critical",
    indicatorLabel: "Critical",
    sourceLabel: "Local formulary",
};

function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(DecisionSupportCard);
    for (const [k, v] of Object.entries({ ...base, ...inputs }))
        fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    return fixture;
}

describe("DecisionSupportCard", () => {
    test("renders a group named by its summary, not a live region", () => {
        const fixture = mount({});
        const card = fixture.nativeElement.querySelector(".decision-support-card") as HTMLElement;
        expect(card.getAttribute("role")).toBe("group");
        expect(card.getAttribute("aria-label")).toBe("Penicillin allergy recorded");
        expect(card.getAttribute("data-indicator")).toBe("critical");
        expect(card.querySelector(".decision-support-card-indicator")?.textContent).toBe(
            "Critical",
        );
        expect(card.hasAttribute("aria-live")).toBe(false);
        expect(card.querySelector("button")).toBeNull();
    });

    test("a suggestion is a button, chosen with Enter or Space", async () => {
        const user = userEvent.setup();
        const fixture = mount({
            suggestions: [
                { id: "cancel", label: "Cancel amoxicillin", isRecommended: true },
                { id: "switch", label: "Prescribe clarithromycin" },
            ],
        });
        const chosen: string[] = [];
        fixture.componentInstance.suggestion.subscribe((id: string) => chosen.push(id));
        const buttons = fixture.nativeElement.querySelectorAll(
            ".decision-support-card-suggestion",
        ) as NodeListOf<HTMLButtonElement>;
        expect(buttons[0].getAttribute("data-recommended")).toBe("true");
        buttons[0].focus();
        await user.keyboard("{Enter}");
        await user.tab();
        await user.keyboard(" ");
        expect(chosen).toEqual(["cancel", "switch"]);
    });

    test("dismissing without a reason is refused when reasons are offered", async () => {
        const user = userEvent.setup();
        const fixture = mount({
            dismissLabel: "Dismiss",
            overrideReasons: [{ code: "error", display: "Allergy recorded in error" }],
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        });
        const dismissed: (string | undefined)[] = [];
        fixture.componentInstance.dismissed.subscribe((reason: string | undefined) =>
            dismissed.push(reason),
        );
        const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
        const button = fixture.nativeElement.querySelector(
            ".decision-support-card-dismiss",
        ) as HTMLButtonElement;
        button.focus();
        await user.keyboard("{Enter}");
        fixture.detectChanges();
        expect(dismissed).toEqual([]);
        expect(select.getAttribute("aria-invalid")).toBe("true");
        expect(document.activeElement).toBe(select);
        await user.selectOptions(select, "error");
        button.focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual(["error"]);
    });
});
