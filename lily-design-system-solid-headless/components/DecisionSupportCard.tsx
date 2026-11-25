// DecisionSupportCard: a clinical decision support card in the CDS Hooks shape (spec/healthcare-ui item 4). Not a live
// region: whether a critical card interrupts is the consumer's choice. Props and rules: DecisionSupportCard.md.

import type { JSX } from "@solidjs/web";
import { omit, createSignal, createEffect, createMemo } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface DecisionSupportSuggestion {
    id: string;
    label: string;
    isRecommended?: boolean;
}

export interface DecisionSupportCardProps {
    class?: string;
    /** Which card this is, for example the CDS Hooks uuid with the patient's id. A new one, or without one a new summary, indicator or source, clears the chosen reason. */
    cardId?: string;
    /** The one-sentence summary; names the card. */
    summary: string;
    indicator: "info" | "warning" | "critical";
    /** The indicator in words, so urgency is never colour alone. */
    indicatorLabel: string;
    sourceLabel: string;
    sourceHref?: string;
    /** The detail. */
    children?: JSX.Element;
    suggestions?: DecisionSupportSuggestion[];
    /** Called with the chosen suggestion's id; the consumer applies it and enforces selectionBehavior. */
    onSuggestion?: (id: string) => void;
    links?: { label: string; href: string }[];
    /** The dismiss button's text; no button without it. */
    dismissLabel?: string;
    /** When given, dismissing asks for one. */
    overrideReasons?: { code: string; display: string }[];
    overrideReasonLabel?: string;
    overrideReasonPlaceholder?: string;
    onDismiss?: (reason?: string) => void;
    label?: string;
    [key: string]: unknown;
}

export default function DecisionSupportCard(props: DecisionSupportCardProps) {
    const p = withDefaults(
        {
            class: "" as const,
            suggestions: [] as NonNullable<DecisionSupportCardProps["suggestions"]>,
            links: [] as NonNullable<DecisionSupportCardProps["links"]>,
            overrideReasons: [] as NonNullable<DecisionSupportCardProps["overrideReasons"]>,
            overrideReasonPlaceholder: "" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "cardId",
        "summary",
        "indicator",
        "indicatorLabel",
        "sourceLabel",
        "sourceHref",
        "children",
        "suggestions",
        "onSuggestion",
        "links",
        "dismissLabel",
        "overrideReasons",
        "overrideReasonLabel",
        "overrideReasonPlaceholder",
        "onDismiss",
        "label",
    );
    const [reason, setReason] = createSignal("");
    const [invalid, setInvalid] = createSignal(false);
    const select: { current: HTMLSelectElement | null } = { current: null };

    // A chosen reason belongs to one card, and to the reasons it offers.
    const identity = createMemo(
        () => p.cardId ?? JSON.stringify([p.summary, p.indicator, p.sourceLabel]),
    );
    const offered = () => p.overrideReasons.some((option) => option.code === reason());
    createEffect(identity, () => {
        setReason("");
        setInvalid(false);
    });
    // New options reset the browser's select, so it is set again whenever they or the choice change.
    createEffect(
        () => [p.overrideReasons, reason()] as const,
        ([reasons, code]) => {
            const kept = reasons.some((option) => option.code === code) ? code : "";
            if (kept !== code) setReason("");
            if (select.current) select.current.value = kept;
        },
    );

    function dismiss(event: Event) {
        event.preventDefault();
        if (p.overrideReasons.length > 0 && !offered()) {
            setInvalid(true);
            select.current?.focus();
            return;
        }
        setInvalid(false);
        p.onDismiss?.(offered() ? reason() : undefined);
    }

    return (
        <div
            class={`decision-support-card ${p.class}`}
            role="group"
            aria-label={p.label ?? p.summary}
            data-indicator={attr(p.indicator)}
            {...restProps}
        >
            <p class="decision-support-card-header">
                <span class="decision-support-card-indicator">{p.indicatorLabel}</span>{" "}
                <span class="decision-support-card-summary">{p.summary}</span>
            </p>
            {p.children ? <div class="decision-support-card-detail">{p.children}</div> : null}
            <p class="decision-support-card-source">
                {p.sourceHref ? <a href={p.sourceHref}>{p.sourceLabel}</a> : p.sourceLabel}
            </p>
            {p.suggestions.length > 0 ? (
                <div class="decision-support-card-suggestions">
                    {p.suggestions.map((suggestion) => (
                        <button
                            type="button"
                            class="decision-support-card-suggestion"
                            data-recommended={attr(suggestion.isRecommended ? "true" : undefined)}
                            onClick={() => p.onSuggestion?.(suggestion.id)}
                        >
                            {suggestion.label}
                        </button>
                    ))}
                </div>
            ) : null}
            {p.links.length > 0 ? (
                <ul class="decision-support-card-links">
                    {p.links.map((link) => (
                        <li>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            ) : null}
            {p.dismissLabel ? (
                <form
                    class="decision-support-card-override"
                    novalidate
                    onSubmit={dismiss}
                >
                    {p.overrideReasons.length > 0 ? (
                        <label class="decision-support-card-override-label">
                            {p.overrideReasonLabel}{" "}
                            <select
                                ref={(el) => (select.current = el)}
                                class="decision-support-card-override-reason"
                                required
                                aria-invalid={attr(invalid() ? "true" : undefined)}
                                value={reason()}
                                onChange={(event) => {
                                    setReason(event.target.value);
                                    setInvalid(false);
                                }}
                            >
                                <option value="">{p.overrideReasonPlaceholder}</option>
                                {p.overrideReasons.map((option) => (
                                    <option value={option.code}>{option.display}</option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                    <button
                        type="submit"
                        class="decision-support-card-dismiss"
                    >
                        {p.dismissLabel}
                    </button>
                </form>
            ) : null}
        </div>
    );
}
