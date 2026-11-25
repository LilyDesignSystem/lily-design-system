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
    test("HC-C7: renders a group named by its summary, not a live region", () => {
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

    test("HC-C8: dismissing without a reason is refused when reasons are offered", async () => {
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

    const A = [
        { code: "aware", display: "Patient tolerated before" },
        { code: "error", display: "Recorded in error" },
    ];
    const B = [{ code: "renal", display: "Dose already reduced" }];
    const other = { summary: "Reduce the dose: renal function" };

    const select = () => document.querySelector("select") as HTMLSelectElement;
    const dismissButton = () =>
        document.querySelector(".decision-support-card-dismiss") as HTMLButtonElement;

    test("HC-C15: another card's reason is never submitted, when the new card offers other reasons", async () => {
        const user = userEvent.setup();
        const first = {
            ...base,
            cardId: "patient-1/card-9",
            dismissLabel: "Dismiss",
            overrideReasons: A,
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        };
        // A changed summary is a new card only when the host gives no cardId.
        const without = { ...first, cardId: undefined as string | undefined };
        const start = "cardId" in { ...other, overrideReasons: B } ? first : without;
        const dismissed: (string | undefined)[] = [];
        document.body.innerHTML = "";
        const fixture = mount(start);
        fixture.componentInstance.dismissed.subscribe((reason) => dismissed.push(reason));
        await user.selectOptions(select(), "error");
        for (const [k, v] of Object.entries({ ...other, overrideReasons: B }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        expect(select().value).toBe("");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual([]);
    });

    test("HC-C15: another card's reason is never submitted, when the new card offers the same reasons", async () => {
        const user = userEvent.setup();
        const first = {
            ...base,
            cardId: "patient-1/card-9",
            dismissLabel: "Dismiss",
            overrideReasons: A,
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        };
        // A changed summary is a new card only when the host gives no cardId.
        const without = { ...first, cardId: undefined as string | undefined };
        const start = "cardId" in { ...other, overrideReasons: A } ? first : without;
        const dismissed: (string | undefined)[] = [];
        document.body.innerHTML = "";
        const fixture = mount(start);
        fixture.componentInstance.dismissed.subscribe((reason) => dismissed.push(reason));
        await user.selectOptions(select(), "error");
        for (const [k, v] of Object.entries({ ...other, overrideReasons: A }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        expect(select().value).toBe("");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual([]);
    });

    test("HC-C15: a new cardId is a new card, even with the same words", async () => {
        const user = userEvent.setup();
        const first = {
            ...base,
            cardId: "patient-1/card-9",
            dismissLabel: "Dismiss",
            overrideReasons: A,
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        };
        // A changed summary is a new card only when the host gives no cardId.
        const without = { ...first, cardId: undefined as string | undefined };
        const start = "cardId" in { cardId: "patient-2/card-9" } ? first : without;
        const dismissed: (string | undefined)[] = [];
        document.body.innerHTML = "";
        const fixture = mount(start);
        fixture.componentInstance.dismissed.subscribe((reason) => dismissed.push(reason));
        await user.selectOptions(select(), "error");
        for (const [k, v] of Object.entries({ cardId: "patient-2/card-9" }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        expect(select().value).toBe("");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual([]);
    });

    test("HC-C15: a reason no longer offered is not submitted", async () => {
        const user = userEvent.setup();
        const first = {
            ...base,
            cardId: "patient-1/card-9",
            dismissLabel: "Dismiss",
            overrideReasons: A,
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        };
        // A changed summary is a new card only when the host gives no cardId.
        const without = { ...first, cardId: undefined as string | undefined };
        const start = "cardId" in { overrideReasons: B } ? first : without;
        const dismissed: (string | undefined)[] = [];
        document.body.innerHTML = "";
        const fixture = mount(start);
        fixture.componentInstance.dismissed.subscribe((reason) => dismissed.push(reason));
        await user.selectOptions(select(), "error");
        for (const [k, v] of Object.entries({ overrideReasons: B }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        expect(select().value).toBe("");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual([]);
    });

    test("HC-C15: the same card keeps its choice when it renders again", async () => {
        const user = userEvent.setup();
        const first = {
            ...base,
            cardId: "patient-1/card-9",
            dismissLabel: "Dismiss",
            overrideReasons: A,
            overrideReasonLabel: "Reason for dismissing",
            overrideReasonPlaceholder: "Choose a reason",
        };
        // A changed summary is a new card only when the host gives no cardId.
        const without = { ...first, cardId: undefined as string | undefined };
        const start = "cardId" in { overrideReasons: A.map((r) => ({ ...r })) } ? first : without;
        const dismissed: (string | undefined)[] = [];
        document.body.innerHTML = "";
        const fixture = mount(start);
        fixture.componentInstance.dismissed.subscribe((reason) => dismissed.push(reason));
        await user.selectOptions(select(), "error");
        for (const [k, v] of Object.entries({ overrideReasons: A.map((r) => ({ ...r })) }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        expect(select().value).toBe("error");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual(["error"]);
    });
});
