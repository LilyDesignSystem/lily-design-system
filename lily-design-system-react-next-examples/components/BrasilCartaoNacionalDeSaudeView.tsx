// BrasilCartaoNacionalDeSaudeView component
//
// A headless display component for showing Brazil's
// Cartão Nacional de Saúde (CNS) in a read-only format.
// Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <BrasilCartaoNacionalDeSaudeView label="Cartão Nacional de Saúde (CNS)" value={value} />
//
// Accessibility:
//   - aria-label provides the accessible name so screen readers announce the purpose
//
// References:
//   - https://en.wikipedia.org/wiki/CPF_number

import React from "react";

export interface BrasilCartaoNacionalDeSaudeViewProps {
    className?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function BrasilCartaoNacionalDeSaudeView({
    className = "",
    label,
    value = "",
    ...restProps
}: BrasilCartaoNacionalDeSaudeViewProps) {
    return (
        <span
        className={`brasil-cartao-nacional-de-saude-view ${className}`}
        aria-label={label}
        {...restProps}>{value}</span
        >
    );
}
