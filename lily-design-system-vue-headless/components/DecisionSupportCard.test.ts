import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./DecisionSupportCard.vue";

const base = {
    summary: "Penicillin allergy recorded",
    indicator: "critical" as const,
    indicatorLabel: "Critical",
    sourceLabel: "Local formulary",
};

describe("DecisionSupportCard", () => {
    test("HC-C7: renders a group named by its summary, not a live region", () => {
        render(Subject, { props: base, slots: { default: "<p>Amoxicillin is a penicillin.</p>" } });
        const card = screen.getByRole("group", { name: "Penicillin allergy recorded" });
        expect(card.getAttribute("data-indicator")).toBe("critical");
        expect(card.querySelector(".decision-support-card-indicator")?.textContent).toBe(
            "Critical",
        );
        expect(card.querySelector(".decision-support-card-detail")?.textContent).toBe(
            "Amoxicillin is a penicillin.",
        );
        expect(card.hasAttribute("aria-live")).toBe(false);
    });

    test("a suggestion is a button, chosen with Enter or Space", async () => {
        const user = userEvent.setup();
        const { emitted } = render(Subject, {
            props: {
                ...base,
                suggestions: [
                    { id: "cancel", label: "Cancel amoxicillin", isRecommended: true },
                    { id: "switch", label: "Prescribe clarithromycin" },
                ],
            },
        });
        screen.getByRole("button", { name: "Cancel amoxicillin" }).focus();
        await user.keyboard("{Enter}");
        await user.tab();
        await user.keyboard(" ");
        expect(emitted().suggestion).toEqual([["cancel"], ["switch"]]);
    });

    test("HC-C8: dismissing without a reason is refused when reasons are offered", async () => {
        const user = userEvent.setup();
        const { emitted } = render(Subject, {
            props: {
                ...base,
                dismissLabel: "Dismiss",
                overrideReasons: [{ code: "error", display: "Allergy recorded in error" }],
                overrideReasonLabel: "Reason for dismissing",
                overrideReasonPlaceholder: "Choose a reason",
            },
        });
        const select = screen.getByRole("combobox", { name: /Reason for dismissing/ });
        screen.getByRole("button", { name: "Dismiss" }).focus();
        await user.keyboard("{Enter}");
        expect(emitted().dismiss).toBeUndefined();
        expect(select.getAttribute("aria-invalid")).toBe("true");
        expect(document.activeElement).toBe(select);
        await user.selectOptions(select, "error");
        screen.getByRole("button", { name: "Dismiss" }).focus();
        await user.keyboard("{Enter}");
        expect(emitted().dismiss).toEqual([["error"]]);
    });

    test("renders links and no dismiss control without its words", () => {
        render(Subject, {
            props: { ...base, links: [{ label: "Guideline", href: "/guideline" }] },
        });
        expect(screen.getByRole("link", { name: "Guideline" }).getAttribute("href")).toBe(
            "/guideline",
        );
        expect(screen.queryByRole("button")).toBeNull();
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
        const { rerender } = render(Subject, {
            props: { ...start, onDismiss: (reason?: string) => dismissed.push(reason) },
        });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, ...{ ...other, overrideReasons: B } });
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
        const { rerender } = render(Subject, {
            props: { ...start, onDismiss: (reason?: string) => dismissed.push(reason) },
        });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, ...{ ...other, overrideReasons: A } });
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
        const { rerender } = render(Subject, {
            props: { ...start, onDismiss: (reason?: string) => dismissed.push(reason) },
        });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, ...{ cardId: "patient-2/card-9" } });
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
        const { rerender } = render(Subject, {
            props: { ...start, onDismiss: (reason?: string) => dismissed.push(reason) },
        });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, ...{ overrideReasons: B } });
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
        const { rerender } = render(Subject, {
            props: { ...start, onDismiss: (reason?: string) => dismissed.push(reason) },
        });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, ...{ overrideReasons: A.map((r) => ({ ...r })) } });
        expect(select().value).toBe("error");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual(["error"]);
    });
});
