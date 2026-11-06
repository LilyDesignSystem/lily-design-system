// NetPromoterScoreView component
//
// A headless Net Promoter Score (NPS) rating view that displays an NPS score
// value as read-only text within a <span> element. Used to show previously
// captured NPS data in dashboards, reports, or detail views. NPS scores range
// from 0 to 10, with respondents classified as Detractors (0-6), Passives (7-8),
// or Promoters (9-10).
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The NPS score value to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <NetPromoterScoreView label="NPS Score" value="8" />
//
// Examples:
//
//   <NetPromoterScoreView label="NPS Score" value="8" />
//
//
//   <NetPromoterScoreView label="Customer rating" value={score} />
//
// Keyboard:
//   - None — this is a passive informational display, not interactive.
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//   - Screen readers announce both the label and the displayed value
//
// Internationalization:
//   - The label prop accepts any translated string
//   - The value is displayed as-is, allowing localized formatting
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No score validation or classification logic; consumer handles categorization
//   - Part of the Input/View pattern; pairs with NetPromoterScorePicker
//
// References:
//   - Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score

import React from "react";

export interface NetPromoterScoreViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The NPS score value to display */
    value?: string;
    [key: string]: unknown;
}

export default function NetPromoterScoreView({
    className = "",
    label,
    value = "",
    ...restProps
}: NetPromoterScoreViewProps) {
    return (
        <span
            className={`net-promoter-score-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {value}
        </span>
    );
}
