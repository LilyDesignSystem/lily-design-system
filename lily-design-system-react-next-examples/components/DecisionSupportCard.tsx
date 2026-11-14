// DecisionSupportCard: a clinical decision support card in the CDS Hooks shape (spec/healthcare-ui item 4). Not a live
// region: whether a critical card interrupts is the consumer's choice. Props and rules: DecisionSupportCard.md.
import React, { useRef, useState } from "react";

export interface DecisionSupportSuggestion {
    id: string;
    label: string;
    isRecommended?: boolean;
}

export interface DecisionSupportCardProps {
    className?: string;
    /** The one-sentence summary; names the card. */
    summary: string;
    indicator: "info" | "warning" | "critical";
    /** The indicator in words, so urgency is never colour alone. */
    indicatorLabel: string;
    sourceLabel: string;
    sourceHref?: string;
    /** The detail. */
    children?: React.ReactNode;
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

export default function DecisionSupportCard({
    className = "",
    summary,
    indicator,
    indicatorLabel,
    sourceLabel,
    sourceHref,
    children,
    suggestions = [],
    onSuggestion,
    links = [],
    dismissLabel,
    overrideReasons = [],
    overrideReasonLabel,
    overrideReasonPlaceholder = "",
    onDismiss,
    label,
    ...restProps
}: DecisionSupportCardProps) {
    const [reason, setReason] = useState("");
    const [invalid, setInvalid] = useState(false);
    const select = useRef<HTMLSelectElement>(null);

    function dismiss(event: React.FormEvent) {
        event.preventDefault();
        if (overrideReasons.length > 0 && !reason) {
            setInvalid(true);
            select.current?.focus();
            return;
        }
        setInvalid(false);
        onDismiss?.(reason || undefined);
    }

    return (
        <div
            className={`decision-support-card ${className}`}
            role="group"
            aria-label={label ?? summary}
            data-indicator={indicator}
            {...restProps}
        >
            <p className="decision-support-card-header">
                <span className="decision-support-card-indicator">{indicatorLabel}</span>{" "}
                <span className="decision-support-card-summary">{summary}</span>
            </p>
            {children ? <div className="decision-support-card-detail">{children}</div> : null}
            <p className="decision-support-card-source">
                {sourceHref ? <a href={sourceHref}>{sourceLabel}</a> : sourceLabel}
            </p>
            {suggestions.length > 0 ? (
                <div className="decision-support-card-suggestions">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            type="button"
                            className="decision-support-card-suggestion"
                            data-recommended={suggestion.isRecommended ? "true" : undefined}
                            onClick={() => onSuggestion?.(suggestion.id)}
                        >
                            {suggestion.label}
                        </button>
                    ))}
                </div>
            ) : null}
            {links.length > 0 ? (
                <ul className="decision-support-card-links">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a href={link.href}>{link.label}</a>
                        </li>
                    ))}
                </ul>
            ) : null}
            {dismissLabel ? (
                <form
                    className="decision-support-card-override"
                    noValidate
                    onSubmit={dismiss}
                >
                    {overrideReasons.length > 0 ? (
                        <label className="decision-support-card-override-label">
                            {overrideReasonLabel}{" "}
                            <select
                                ref={select}
                                className="decision-support-card-override-reason"
                                required
                                aria-invalid={invalid ? "true" : undefined}
                                value={reason}
                                onChange={(event) => {
                                    setReason(event.target.value);
                                    setInvalid(false);
                                }}
                            >
                                <option value="">{overrideReasonPlaceholder}</option>
                                {overrideReasons.map((option) => (
                                    <option
                                        key={option.code}
                                        value={option.code}
                                    >
                                        {option.display}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}
                    <button
                        type="submit"
                        className="decision-support-card-dismiss"
                    >
                        {dismissLabel}
                    </button>
                </form>
            ) : null}
        </div>
    );
}
