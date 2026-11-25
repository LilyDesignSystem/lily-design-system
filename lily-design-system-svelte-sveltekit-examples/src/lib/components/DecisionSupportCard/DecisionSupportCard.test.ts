import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./DecisionSupportCard.svelte";

const base = {
    summary: "Penicillin allergy recorded",
    indicator: "critical" as const,
    indicatorLabel: "Critical",
    sourceLabel: "Local formulary",
};

describe("DecisionSupportCard", () => {
    test("renders a group named by its summary, with the indicator as data and words", () => {
        render(Subject, { props: base });
        const card = screen.getByRole("group", { name: "Penicillin allergy recorded" });
        expect(card.getAttribute("class")).toContain("decision-support-card");
        expect(card.getAttribute("data-indicator")).toBe("critical");
        expect(card.querySelector(".decision-support-card-indicator")?.textContent).toBe(
            "Critical",
        );
        expect(card.querySelector(".decision-support-card-source")?.textContent?.trim()).toBe(
            "Local formulary",
        );
    });

    test("HC-C7: is not a live region, so it never interrupts by itself", () => {
        render(Subject, { props: base });
        const card = screen.getByRole("group");
        expect(card.hasAttribute("aria-live")).toBe(false);
        expect(card.getAttribute("role")).toBe("group");
    });

    test("renders the detail, a source link and links", () => {
        const detail = createRawSnippet(() => ({
            render: () => "<p>Amoxicillin is a penicillin.</p>",
        }));
        render(Subject, {
            props: {
                ...base,
                sourceHref: "/formulary",
                children: detail,
                links: [{ label: "Guideline", href: "/guideline" }],
            },
        });
        expect(screen.getByRole("link", { name: "Local formulary" }).getAttribute("href")).toBe(
            "/formulary",
        );
        expect(screen.getByRole("link", { name: "Guideline" }).getAttribute("href")).toBe(
            "/guideline",
        );
        expect(document.querySelector(".decision-support-card-detail")?.textContent).toBe(
            "Amoxicillin is a penicillin.",
        );
    });

    test("a suggestion is a button, chosen with Enter or Space", async () => {
        const user = userEvent.setup();
        const onSuggestion = vi.fn();
        render(Subject, {
            props: {
                ...base,
                suggestions: [
                    { id: "cancel", label: "Cancel amoxicillin", isRecommended: true },
                    { id: "switch", label: "Prescribe clarithromycin" },
                ],
                onSuggestion,
            },
        });
        const first = screen.getByRole("button", { name: "Cancel amoxicillin" });
        expect(first.getAttribute("data-recommended")).toBe("true");
        first.focus();
        await user.keyboard("{Enter}");
        expect(onSuggestion).toHaveBeenLastCalledWith("cancel");
        await user.tab();
        expect(document.activeElement).toBe(
            screen.getByRole("button", { name: "Prescribe clarithromycin" }),
        );
        await user.keyboard(" ");
        expect(onSuggestion).toHaveBeenLastCalledWith("switch");
    });

    test("HC-C8: dismissing without a reason is refused when reasons are offered", async () => {
        const user = userEvent.setup();
        const onDismiss = vi.fn();
        render(Subject, {
            props: {
                ...base,
                dismissLabel: "Dismiss",
                overrideReasons: [
                    { code: "aware", display: "Patient tolerated before" },
                    { code: "error", display: "Allergy recorded in error" },
                ],
                overrideReasonLabel: "Reason for dismissing",
                overrideReasonPlaceholder: "Choose a reason",
                onDismiss,
            },
        });
        const select = screen.getByRole("combobox", { name: /Reason for dismissing/ });
        screen.getByRole("button", { name: "Dismiss" }).focus();
        await user.keyboard("{Enter}");
        expect(onDismiss).not.toHaveBeenCalled();
        expect(select.getAttribute("aria-invalid")).toBe("true");
        expect(document.activeElement).toBe(select);

        await user.selectOptions(select, "error");
        expect(select.hasAttribute("aria-invalid")).toBe(false);
        screen.getByRole("button", { name: "Dismiss" }).focus();
        await user.keyboard("{Enter}");
        expect(onDismiss).toHaveBeenCalledWith("error");
    });

    test("with no reasons offered, dismiss calls onDismiss at once", async () => {
        const user = userEvent.setup();
        const onDismiss = vi.fn();
        render(Subject, {
            props: { ...base, indicator: "info", dismissLabel: "Dismiss", onDismiss },
        });
        await user.click(screen.getByRole("button", { name: "Dismiss" }));
        expect(onDismiss).toHaveBeenCalledWith(undefined);
        expect(screen.queryByRole("combobox")).toBeNull();
    });

    test("renders no dismiss control without its words", () => {
        render(Subject, { props: base });
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
        const onDismiss = (reason?: string) => void dismissed.push(reason);
        const { rerender } = render(Subject, { props: { ...start, onDismiss } });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, onDismiss, ...{ ...other, overrideReasons: B } });
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
        const onDismiss = (reason?: string) => void dismissed.push(reason);
        const { rerender } = render(Subject, { props: { ...start, onDismiss } });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, onDismiss, ...{ ...other, overrideReasons: A } });
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
        const onDismiss = (reason?: string) => void dismissed.push(reason);
        const { rerender } = render(Subject, { props: { ...start, onDismiss } });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, onDismiss, ...{ cardId: "patient-2/card-9" } });
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
        const onDismiss = (reason?: string) => void dismissed.push(reason);
        const { rerender } = render(Subject, { props: { ...start, onDismiss } });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, onDismiss, ...{ overrideReasons: B } });
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
        const onDismiss = (reason?: string) => void dismissed.push(reason);
        const { rerender } = render(Subject, { props: { ...start, onDismiss } });
        await user.selectOptions(select(), "error");
        await rerender({ ...start, onDismiss, ...{ overrideReasons: A.map((r) => ({ ...r })) } });
        expect(select().value).toBe("error");
        dismissButton().focus();
        await user.keyboard("{Enter}");
        expect(dismissed).toEqual(["error"]);
    });
});
