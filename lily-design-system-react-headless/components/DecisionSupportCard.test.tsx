import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./DecisionSupportCard";

const base = {
    summary: "Penicillin allergy recorded",
    indicator: "critical" as const,
    indicatorLabel: "Critical",
    sourceLabel: "Local formulary",
};

describe("DecisionSupportCard", () => {
    test("renders a group named by its summary, not a live region", () => {
        render(<Subject {...base} />);
        const card = screen.getByRole("group", { name: "Penicillin allergy recorded" });
        expect(card.getAttribute("data-indicator")).toBe("critical");
        expect(card.querySelector(".decision-support-card-indicator")?.textContent).toBe(
            "Critical",
        );
        expect(card.hasAttribute("aria-live")).toBe(false);
    });

    test("a suggestion is a button, chosen with Enter or Space", async () => {
        const user = userEvent.setup();
        const onSuggestion = vi.fn();
        render(
            <Subject
                {...base}
                suggestions={[
                    { id: "cancel", label: "Cancel amoxicillin", isRecommended: true },
                    { id: "switch", label: "Prescribe clarithromycin" },
                ]}
                onSuggestion={onSuggestion}
            />,
        );
        screen.getByRole("button", { name: "Cancel amoxicillin" }).focus();
        await user.keyboard("{Enter}");
        expect(onSuggestion).toHaveBeenLastCalledWith("cancel");
        await user.tab();
        await user.keyboard(" ");
        expect(onSuggestion).toHaveBeenLastCalledWith("switch");
    });

    test("dismissing without a reason is refused when reasons are offered", async () => {
        const user = userEvent.setup();
        const onDismiss = vi.fn();
        render(
            <Subject
                {...base}
                dismissLabel="Dismiss"
                overrideReasons={[{ code: "error", display: "Allergy recorded in error" }]}
                overrideReasonLabel="Reason for dismissing"
                overrideReasonPlaceholder="Choose a reason"
                onDismiss={onDismiss}
            />,
        );
        const select = screen.getByRole("combobox", { name: /Reason for dismissing/ });
        screen.getByRole("button", { name: "Dismiss" }).focus();
        await user.keyboard("{Enter}");
        expect(onDismiss).not.toHaveBeenCalled();
        expect(select.getAttribute("aria-invalid")).toBe("true");
        expect(document.activeElement).toBe(select);
        await user.selectOptions(select, "error");
        screen.getByRole("button", { name: "Dismiss" }).focus();
        await user.keyboard("{Enter}");
        expect(onDismiss).toHaveBeenCalledWith("error");
    });

    test("renders links and no dismiss control without its words", () => {
        render(
            <Subject
                {...base}
                links={[{ label: "Guideline", href: "/guideline" }]}
            />,
        );
        expect(screen.getByRole("link", { name: "Guideline" }).getAttribute("href")).toBe(
            "/guideline",
        );
        expect(screen.queryByRole("button")).toBeNull();
    });
});
